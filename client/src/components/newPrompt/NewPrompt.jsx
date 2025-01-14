import { useEffect, useRef, useState } from "react";
import "./newPrompt.css";
import Upload from "../upload/Upload";
import { IKImage } from "imagekitio-react";
import Markdown from "react-markdown";
import { useUser } from "@clerk/clerk-react";
import { useQueryClient } from "@tanstack/react-query";

const NewPrompt = ({ data }) => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [img, setImg] = useState({
    isLoading: false,
    error: "",
    dbData: {},
    aiData: {},
  });
  console.log(data);
  const textareaRef = useRef(null);

  const history =
    data?.history?.map(({ role, parts }) => ({
      role,
      parts: parts.map((part) => ({ text: part.text })),
    })) || [];

  console.log("history" , history);

  

  const { user } = useUser();
  const userId = user?.id;

  const endRef = useRef(null);
  const formRef = useRef(null);

  const queryClient = useQueryClient();

  useEffect(() => {
    endRef.current.scrollIntoView({ behavior: "smooth" });
  }, [data, question, answer, img.dbData]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const text = e.target.text.value;
    if (!text) return;
    if (textareaRef.current) {
      textareaRef.current.value = "";
    }
    setQuestion(text);
    setAnswer(""); // Clear previous answer

    try {
      const response = await fetch(`http://localhost:8000/chats/${data._id}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          add: false,
          userId : userId,
          question: text,
          img: img.dbData?.filePath || undefined,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch streaming response");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");

      let accumulatedText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunkText = decoder.decode(value, { stream: true });
        accumulatedText += chunkText;
        setAnswer(accumulatedText); // Dynamically update answer
      }

      // Invalidate the cache to reflect updated chat history
      queryClient.invalidateQueries({ queryKey: ["chat", data._id] });
    } catch (err) {
      console.error("Error during streaming response:", err);
    }
    setAnswer("");
    setQuestion("");
  };

  return (
    <>
      {img.isLoading && <div className="">Loading...</div>}
      {img.dbData?.filePath && (
        <IKImage
          urlEndpoint={import.meta.env.VITE_IMAGE_KIT_ENDPOINT}
          path={img.dbData?.filePath}
          width="380"
          transformation={[{ width: 380 }]}
        />
      )}
      {question && <div className="message user">{question}</div>}
      {answer && (
        <div className="message bot">
          <Markdown>{answer}</Markdown>
        </div>
      )}
      <div className="endChat" ref={endRef}></div>
      <div className="newContainer">
        <form className="newForm" onSubmit={handleSubmit} ref={formRef}>
          <input id="file" type="file" multiple={false} hidden />
          <textarea
            ref={textareaRef}
            type="text"
            name="text"
            placeholder="Ask anything..."
            style={{
              maxHeight: "180px",
              overflow: "auto",
            }}
            onInput={(e) => {
              e.target.style.height = "auto";
              const maxHeight = 300;
              if (e.target.scrollHeight > maxHeight) {
                e.target.style.height = `${maxHeight}px`;
              } else {
                e.target.style.height = `${e.target.scrollHeight}px`;
              }
            }}
          />
          <button>
            <img src="/arrow-green.svg" alt="" />
          </button>
        </form>
      </div>
    </>
  );
};

export default NewPrompt;
