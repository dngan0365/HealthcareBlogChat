import { useMutation, useQueryClient } from "@tanstack/react-query";
import "./dashboardPage.css";
import { useNavigate } from "react-router-dom";

const DashboardPage = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Mutation for creating a new chat
  const mutation = useMutation({
    mutationFn: async (text) => {
      return fetch(`${import.meta.env.VITE_API_URL}/chats`, {
        method: "POST",
        credentials: "include", // Ensure the request includes authentication cookies
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }), // Send the chat text
      }).then((res) => {
        if (!res.ok) {
          throw new Error("Failed to create chat");
        }
        return res.json(); // This should return { chatId }
      });
    },
    onSuccess: (data) => {
      // Invalidate and refetch userChats query to get the updated list
      queryClient.invalidateQueries({ queryKey: ["userChats"] });
      console.log("post data.chatId "+ data.chatId)
      // Navigate to the newly created chat page using the chatId from the response
      navigate(`/dashboard/chats/${data.chatId}`);
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const text = e.target.text.value;
    console.log(text);
    if (!text) return;

    // Trigger the mutation with the input text
    mutation.mutate(text);
  };

  return (
    <div className="dashboardPage">
      <div className="texts">
        <div className="logo">
          <img src="/logoChat.svg" alt="" />
          <h1>MedComp</h1>
        </div>
        <div className="options">
          <div className="option">
            <img src="/symptom_checker.webp" alt="" />
            <span>Symptom Checker</span>
          </div>
          <div className="option">
            <img src="/health_monitor1.png" alt="" />
            <span>Health Monitoring</span>
          </div>
          <div className="option">
            <img src="/medicine2.avif" alt="" />
            <span>Medication Management</span>
          </div>
        </div>
      </div>
      <div className="formContainer">
        <form onSubmit={handleSubmit}>
          <textarea type="text" name="text" placeholder="Ask me anything..."
                style={{
                  maxHeight: '180px', // Set maximum height
                  overflow: 'auto',   // Add scrollbars if content exceeds maxHeight
                }}
                onInput={(e) => {
                  e.target.style.height = 'auto'; // Reset height
                  const maxHeight = 300; // Define maximum height
                  if (e.target.scrollHeight > maxHeight) {
                    e.target.style.height = `${maxHeight}px`;
                  } else {
                    e.target.style.height = `${e.target.scrollHeight}px`; // Adjust height
                  }
                }} />
          <button>
            <img src="/arrow-green.svg" alt="" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default DashboardPage;
