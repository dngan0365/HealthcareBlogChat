from fastapi import APIRouter, Depends, HTTPException, Request, FastAPI
from fastapi.responses import StreamingResponse
from odmantic import AIOEngine
from typing import AsyncGenerator
from backend.models.chat import Chat
from backend.models.userChats import UserChats
from openai import OpenAI
from datetime import datetime
from pymongo import MongoClient
from bson import ObjectId
import time 
import logging
# import openai
from llm_integration.openai_client import get_llmTitle
from core.ai.ai_service import get_answer_stream
from llama_index.core import PromptTemplate
#from backend.services.clerk import get_current_user  
import yaml
import warnings
import csv
import os
warnings.filterwarnings("ignore", category=ResourceWarning)


# Load YAML configuration file
def load_config(config_file="../configs/api_keys.yaml"):
    with open(config_file, "r") as file:
        return yaml.safe_load(file)

# Load the OpenAI API key from the YAML file
config = load_config()
url=config["mongodb"]["url"]
client = MongoClient(url, connect=False)
db = client["BlogHealth"]
chat_collection = db["chats"]
user_chats_collection = db["userchats"]


router = APIRouter()


# Function to stream GPT response
async def generate_gpt_response(prompt: str) -> AsyncGenerator[str, None]:
    """
    Generates a GPT response for the given prompt using OpenAI's GPT API.
    """
    system_str = """
"Bạn là trợ lý tạo ra câu tóm tắt ngắn gọn cho một đoạn hội thoại khi chỉ biết một câu đầu tiên trong đoạn hội thoại. Nhiệm vụ của bạn là tạo ra một câu không quá 15 từ nói về chủ đề của cuộc hội thoại (trong tiêu đề không được nhắc 'hội thoại', 'khách hàng').\
Ví dụ một số tiêu đề: 
Chỉ số BMI.
Đồ ăn tốt cho sức khỏe.
Lịch trình làm việc hôm nay. 
Tâm lý vị thành niên.
Dinh dưỡng.
Chuẩn đoán và phòng ngừa các bệnh nội khoa.
Lối sống, sinh hoạt, thói quen."
"""
    try:        
        # Use the updated `chat_completions` API for streaming
        clientOpenai = get_llmTitle()
        response = clientOpenai.complete(f"{system_str}\n{prompt}\nSumary:")
        # print(response)
        
        return str(response)
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
    async for token in get_answer_stream(question, user_id=user_id, chat_id=None):
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
    title_prompt = f"khách hàng: {question} \nnhân viên: {gpt_response}"
    title = await generate_gpt_response(title_prompt)  # Replace this with your GPT function

    # Update or create user's chat list
    user_chats = user_chats_collection.find_one({"user": user_id})
    chat_entry = {
        "_id": str(result.inserted_id),
        "title":  str(title).strip('"'),
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
        gpt_response=""
        gpt_response_parts = []
        time_start = time.time()
        async for token in get_answer_stream(question, user_id=user_id, chat_id=chat_id):
            if token and not token.startswith("Error:"):
                time_end = time.time()
                gpt_response_parts.append(token)
                yield f"{token} "
            else:
                print(f"Skipped invalid token: {token}")
            
                # Save new messages to chat history
            gpt_response = "".join(gpt_response_parts)
        time
        print("final answer: " + gpt_response)
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
