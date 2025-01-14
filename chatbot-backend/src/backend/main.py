from fastapi import FastAPI, Depends, Response, status # <- (2)
from fastapi.middleware.cors import CORSMiddleware
from backend.routes.chat import router as chat_router
from odmantic import AIOEngine
from motor.motor_asyncio import AsyncIOMotorClient
from decouple import config
import requests # <- (1)
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from typing import Annotated
from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app: FastAPI):
    # You can do some setup tasks here (e.g., opening DB connections)
    yield
    # You can do some cleanup tasks here (e.g., closing DB connections)
    print("Shutting down gracefully")

app = FastAPI(lifespan=lifespan)

# Configure CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Add your frontend's URL here
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
)

# Replace with your MongoDB Atlas connection string
MONGODB_ATLAS_URI = "mongodb+srv://22520929:dngan0365.@healthcare.2k8fb.mongodb.net/?retryWrites=true&w=majority&appName=HealthCare"
CLERK_PEM_PUBLIC_KEY ="pk_test_c3RpcnJlZC1tb25rZmlzaC05MC5jbGVyay5hY2NvdW50cy5kZXYk"

security = HTTPBearer()

@app.on_event("startup")
async def startup_event():
    # Initialize MongoDB connection
    app.state.mongo_client = AsyncIOMotorClient(MONGODB_ATLAS_URI)
    # Initialize ODMantic engine
    app.state.engine = AIOEngine(client=app.state.mongo_client, database="BlogHealth")



# Dependency to access the MongoDB engine
def get_engine():
    return app.state.engine

# Include routers
app.include_router(chat_router, prefix="/chats", tags=["chat"])
