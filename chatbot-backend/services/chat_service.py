from langchain_openai import ChatOpenAI
from services.weaviate_service import query_vectorstore
from utils.config import OPENAI_API_KEY
from langchain.schema import AIMessage, HumanMessage

OPENAI_API_KEY = "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"

llm = ChatOpenAI(model="gpt-4o-mini", api_key=OPENAI_API_KEY, temperature=0.7)

def chat_with_context(user_id, question):
    try:
        history = query_vectorstore(question, user_id)

        if not history:  # If no history is found, add a new record for the user
            print(f"No history found for user: {user_id}")
            # Add logic here to add the user and initial context to the vector store
            # For example:
            # add_user_to_vectorstore(user_id, initial_data="Welcome to the chat!")

            return "It looks like you're a new user. How can I assist you?"

        context = " ".join([item["message"] for item in history])
        prompt = f"{context}\nUser: {question}\nAssistant:"
        response = llm(prompt)
        # Ensure response is of type string and not a message object
        if isinstance(response, AIMessage):
            answer = response.content
        elif isinstance(response, list) and isinstance(response[0], AIMessage):
            answer = response[0].content
        else:
            answer = response  # if it's already a string, use it directly

        print(f"Response: {answer}")
        return answer

    except Exception as e:
        print(f"Error in chat_with_context: {e}")
        raise
