from odmantic import AIOEngine
from pymongo import MongoClient


clientOpenai = OpenAI(api_key="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")
client = MongoClient("mongodb+srv://22520929:dngan0365.@healthcare.2k8fb.mongodb.net/?retryWrites=true&w=majority&appName=HealthCare")
db = client["BlogHealth"]
chat_collection = db["chats"]
user_chats_collection = db["userchats"]

def get_recent_chat_history(chat_id: str):
    """
    Lấy lịch sử chat gần đây của một đoạn chat
    Args:
        thread_id (str): ID của chat
    Returns:
        List[Chat]: Danh sách các chat
    """
    if (chat_id is None):
        return []
    return chat_collection.find({"chat_id": chat_id}).sort("created_at", -1).limit(10)

def format_chat_history(history):
    """
    Format lịch sử chat thành dạng list các chat
    Args:
        history: Lịch sử chat
    Returns:
        List[Chat]: Danh sách các chat
    """
    formatted_history = []
    for msg in reversed(history):  # Reverse to get chronological order
        formatted_history.extend([
            {"role": "human", "content": msg["question"]},
            {"role": "assistant", "content": msg["answer"]}
        ])
    return formatted_history

def get_user_info(user_id: str):
    """
    Lấy thông tin người dùng từ database
    Args:
        user_id (str): ID của người dùng
    Returns:
        Dict: Thông tin người dùng
    """
    user = user_chats_collection.find_one({"user_id": user_id})
    return user

def format_user_info(user):
    """
    Format thông tin người dùng thành dạng dict.
    Args:
        user: Thông tin người dùng (dạng dict)
    Returns:
        Dict: Thông tin người dùng (chỉ bao gồm các trường không phải None)
    """
    # Create a dictionary and add fields only if they are not None
    formatted_user = {}

    if user.get("name") is not None:
        formatted_user["name"] = user["name"]
    if user.get("age") is not None:
        formatted_user["age"] = user["age"]
    if user.get("gender") is not None:
        formatted_user["gender"] = user["gender"]
    if user.get("weight") is not None:
        formatted_user["weight"] = f'{user["weight"]} (kg)'
    if user.get("height") is not None:
        formatted_user["height"] = f'{user["height"]} (m)'

    return formatted_user