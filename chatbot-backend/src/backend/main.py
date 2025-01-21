from fastapi import FastAPI, Depends, Response, status # <- (2)
from fastapi.middleware.cors import CORSMiddleware
from backend.routes.chat import router as chat_router
from odmantic import AIOEngine
from motor.motor_asyncio import AsyncIOMotorClient
import requests # <- (1)
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from typing import Annotated
from contextlib import asynccontextmanager
import asyncio

from llm_integration.huggingface_client import embed_model
from llm_integration.openai_client import llmAgent, llmRetriever, llmTitle, llmTransform
from llm_integration.weaviate_client import weaviate_client
import warnings
warnings.filterwarnings("ignore", category=ResourceWarning)

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("App is starting")
    # Create MongoDB client here during app startup
    # Store the embed_model in app.state during startup
    app.state.embed_model = embed_model
    app.state.llmAgent = llmAgent
    app.state.llmRetriever = llmRetriever
    app.state.llmTitle = llmTitle
    app.state.llmTransform = llmTransform
    app.state.weaviate_client = weaviate_client
    try: 
        yield  # The app runs while yielding
        print("App is shutting down")
    finally:
        print("App is shutting down")


app = FastAPI(lifespan=lifespan)

# Configure CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Add your frontend's URL here
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
)


# Include routers
app.include_router(chat_router, prefix="/chats", tags=["chat"])
