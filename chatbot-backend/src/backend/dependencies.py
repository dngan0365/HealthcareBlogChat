from odmantic import AIOEngine
from motor.motor_asyncio import AsyncIOMotorClient

def get_engine():
    client = AsyncIOMotorClient("mongodb+srv://22520929:dngan0365.@healthcare.2k8fb.mongodb.net/?retryWrites=true&w=majority&appName=HealthCare")
    return AIOEngine(client, database="BlogHealth")