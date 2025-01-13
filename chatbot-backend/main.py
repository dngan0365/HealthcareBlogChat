from fastapi import FastAPI, HTTPException
from models.chat_model import ChatRequest, ChatResponse
from services.chat_service import chat_with_context
from services.weaviate_service import add_to_vectorstore
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()

# Configure CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Add your frontend's URL here
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
)

@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    print(f"User ID: {request.user_id}, Question: {request.question}")
    try:
        answer = chat_with_context(request.user_id, request.question)
        add_to_vectorstore(request.question, request.user_id)  # Add question to history
        add_to_vectorstore(answer, request.user_id)           # Add response to history
        return ChatResponse(answer=answer)
    except Exception as e:
        print(f"Error in /chat endpoint: {e}")
        raise HTTPException(status_code=500, detail=str(e))
