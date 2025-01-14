from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi.responses import StreamingResponse
from odmantic import AIOEngine
from typing import AsyncGenerator
from backend.models.chat import Chat
from backend.models.userChats import UserChats
from openai import OpenAI
from datetime import datetime
from backend.schemas import CreateChatRequest
from pymongo import MongoClient
from bson import ObjectId
import time 
#from backend.services.clerk import get_current_user  

clientOpenai = OpenAI(api_key="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")
client = MongoClient("mongodb+srv://22520929:dngan0365.@healthcare.2k8fb.mongodb.net/?retryWrites=true&w=majority&appName=HealthCare")
db = client["BlogHealth"]
chat_collection = db["chats"]
user_chats_collection = db["userchats"]


# Configure OpenAI API key
# openai.api_key = "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"

# Initialize the API router
router = APIRouter()

# Function to stream GPT response
async def stream_gpt_response(prompt: str) -> AsyncGenerator[str, None]:
    """
    Stream GPT response using OpenAI's updated API.
    """
    try:
        # Define the chatbot's role and user message
        system_message = {
            "role": "system",
            "content": (
                "You are a helpful chatbot specializing in health and wellness. "
                "Provide accurate, concise, and empathetic answers to user queries. "
                "If unsure, suggest consulting a professional."
            ),
        }
        user_message = {"role": "user", "content": prompt}
        print(f"user_message {user_message}")
        # record the time before the request is sent
        start_time = time.time()
        
        # Use the updated `chat_completions` API for streaming
        response = clientOpenai.chat.completions.create(
            model="gpt-4",
            messages=[system_message, user_message],
            temperature=0.7,
            stream=True,  # Enable streaming
            stream_options={"include_usage": True}, # retrieving token usage for stream response
        )

        # Calculate the time it took to receive the response
        response_time = time.time() - start_time
        print(f"Streaming started {response_time:.2f} seconds after request")

        # Iterate over the streamed chunks
        # for chunk in response:
        #         delta = chunk.choices[0].delta
        #         if "content" in delta:
        #             print(f"Streaming content: {delta['content']}")
        #             yield delta["content"]
                    
        for chunk in response:
            if chunk.choices[0].delta.content:
                content = chunk.choices[0].delta.content
                print(content)
                yield content
                print("****************")
        
    except Exception as e:
        yield f"Error: {str(e)}"

# Function to stream GPT response
async def generate_gpt_response(prompt: str) -> AsyncGenerator[str, None]:
    """
    Generates a GPT response for the given prompt using OpenAI's GPT API.
    """
    try:        
        # Use the updated `chat_completions` API for streaming
        response = clientOpenai.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are an assistant that generates concise and accurate responses. The sentence is not above 40 words."},
                {"role": "user", "content": prompt}],
            temperature=0.7,
        )
        print(response)
        
        return response.choices[0].message.content.strip()
    except Exception as e:
        # Log and return an error message if an exception occurs
        print(f"Error during GPT generation: {str(e)}")
        return f"Error: {str(e)}"
  
# [POST] Create a new chat and stream GPT response
@router.post("/")
async def create_chat_stream(request: Request):
    body = await request.json()
    question = body.get("text")
    user_id = body.get("userId")

    if not user_id:
        raise HTTPException(status_code=400, detail="User authentication is required.")
    if not question:
        raise HTTPException(status_code=400, detail="Chat content is required.")

    gpt_response_parts = []
    async for token in stream_gpt_response(question):
        if token and not token.startswith("Error:"):
            gpt_response_parts.append(token)
        else:
            print(f"Skipped invalid token: {token}")
        
            # Save new messages to chat history
            gpt_response = "".join(gpt_response_parts)
    
    new_chat = {
        "user": user_id,
        "history": [{"role": "user", "parts": [{"text": question}]},
                     {"role": "model", "parts": [{"text": gpt_response}]},],
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow(),
    }
    result = chat_collection.insert_one(new_chat)
    chat_id = str(result.inserted_id)
    
   
    # Generate a title for the chat using GPT
    title_prompt = f"Create a concise and descriptive title for the following chat question:\n{question}"
    title = await generate_gpt_response(title_prompt)  # Replace this with your GPT function

    # Update or create user's chat list
    user_chats = user_chats_collection.find_one({"user": user_id})
    chat_entry = {
        "_id": str(result.inserted_id),
        "title": title,
        "created_at": datetime.utcnow(),
    }
    if not user_chats:
        user_chats_collection.insert_one({
            "user": user_id,
            "chats": [chat_entry],
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
        })
    else:
        user_chats_collection.update_one(
            {"user": user_id},
            {"$push": {"chats": chat_entry}, "$set": {"updated_at": datetime.utcnow()}},
        )
    print(result.inserted_id)
    # Add the chatId to the final response
    
    
    

    return {"chatId": chat_id}

@router.put("/{chat_id}", response_class=StreamingResponse)
async def add_question_stream(chat_id: str, request: Request):
    body = await request.json()
    question = body.get("question")
    user_id = body.get("userId")
    add = body.get("add")

    if not user_id:
        raise HTTPException(status_code=400, detail="User authentication is required.")
    if not question:
        raise HTTPException(status_code=400, detail="Question content is required.")

    async def event_stream():
        gpt_response_parts = []
        async for token in stream_gpt_response(question):
            if token and not token.startswith("Error:"):
                gpt_response_parts.append(token)
                yield f"{token} "
            else:
                print(f"Skipped invalid token: {token}")
            
                # Save new messages to chat history
                gpt_response = "".join(gpt_response_parts)


        if not add:
            # Add both user and model responses to history
            new_items = [
                {"role": "user", "parts": [{"text": question}]},
                {"role": "model", "parts": [{"text": gpt_response}]},
            ]
            result = chat_collection.update_one(
                {"_id": ObjectId(chat_id), "user": user_id},
                {"$push": {"history": {"$each": new_items}}, "$set": {"updated_at": datetime.utcnow()}},
            )
        else:
            # Add only model response to history
            new_items = [
                {"role": "model", "parts": [{"text": gpt_response}]},
            ]
            result = chat_collection.update_one(
                {"_id": ObjectId(chat_id), "user": user_id},
                {"$push": {"history": {"$each": new_items}}, "$set": {"updated_at": datetime.utcnow()}},
            )

        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Chat not found.")

    return StreamingResponse(event_stream(), media_type="text/plain")