import { useEffect, useRef, useState } from "react";
import "./newPrompt.css";
import Upload from "../upload/Upload";
import { IKImage } from "imagekitio-react";
import model from "../../lib/gemini";
import Markdown from "react-markdown";
import { useUser } from "@clerk/clerk-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const NewPrompt = ({ data }) => {
  console.log("newprompt data ",data)
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [img, setImg] = useState({
    isLoading: false,
    error: "",
    dbData: {},
    aiData: {},
  });
   // Ensure history is properly formatted
   const history = data?.history?.map(({ role, parts }) => ({
    role,
    parts: parts.map((part) => ({ text: part.text })),
  })) || [];



  console.log("history newprompt ",history)

  const { user } = useUser();
  const userId = user?.id;

  const endRef = useRef(null);
  const formRef = useRef(null);

  const queryClient = useQueryClient();

  useEffect(() => {
    endRef.current.scrollIntoView({ behavior: "smooth" });
  }, [data, question, answer, img.dbData]);

  // POST method: fetch the answer
  const fetchAnswer = async (text) => {
    const response = await fetch("http://localhost:8000/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: userId,
        question : text,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch the answer");
    }

    const result = await response.json();
    return result.answer;
  };

  // PUT mutation: update the backend with the question and answer
  const putMutation = useMutation({
    mutationFn: async ({ question, answer, img }) => {
      return fetch(`${import.meta.env.VITE_API_URL}/chats/${data._id}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question,
          answer,
          img: img?.filePath || undefined,
        }),
      }).then((res) => res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chat", data._id] }).then(() => {
        formRef.current.reset();
        setQuestion("");
        setAnswer("");
        setImg({
          isLoading: false,
          error: "",
          dbData: {},
          aiData: {},
        });
      });
    },
    onError: (err) => {
      console.error("Error during PUT mutation:", err);
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const text = e.target.text.value;
    if (!text) return;

    try {
      // Set the question state
      console.log("question1 ",text)
      setQuestion(text);
      console.log("question2 ",question)
      // Step 1: Fetch the answer using POST
      const fetchedAnswer = await fetchAnswer(text);
      setAnswer(fetchedAnswer);

      // Step 2: Save the question and answer using PUT
      putMutation.mutate({ question: text, answer: fetchedAnswer, img: img.dbData });
    } catch (err) {
      console.error("Error during chat update:", err);
    }
  };
  return (
    <>
      {/* ADD NEW CHAT */}
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
          {/* <img src ="/logoChat.svg" alt="chat" className="chatIcon"/> */}
          <Markdown>{answer}</Markdown>
        </div>
      )}
      <div className="endChat" ref={endRef}></div>
      <div className="newContainer">
        <form className="newForm" onSubmit={handleSubmit} ref={formRef}>
          {/* <Upload setImg={setImg} /> */}
          <input id="file" type="file" multiple={false} hidden />
          <textarea
            type="text"
            name="text"
            placeholder="Ask anything..."
            style={{
              maxHeight: "180px", // Set maximum height
              overflow: "auto", // Add scrollbars if content exceeds maxHeight
            }}
            onInput={(e) => {
              e.target.style.height = "auto"; // Reset height
              const maxHeight = 300; // Define maximum height
              if (e.target.scrollHeight > maxHeight) {
                e.target.style.height = `${maxHeight}px`;
              } else {
                e.target.style.height = `${e.target.scrollHeight}px`; // Adjust height
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
