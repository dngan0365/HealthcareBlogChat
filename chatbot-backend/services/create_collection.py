import weaviate
from weaviate import Client, AuthApiKey

WEAVIATE_URL = "https://mz1cnucrsmyx1ez2kcelna.c0.asia-southeast1.gcp.weaviate.cloud"
WEAVIATE_API_KEY = "Qam226KOCXarLmqnVndGulifELsoUihGq2TQ"

# Configure the Weaviate client with API key authentication
auth_config = AuthApiKey(api_key=WEAVIATE_API_KEY)

weaviate_client = Client(
    url=WEAVIATE_URL,  # Sandbox instance URL
    auth_client_secret=auth_config  # Use the API key for authentication
)


schema = {
    "classes": [
        {
            "class": "ChatHistory",
            "description": "Chat messages associated with a user.",
            "properties": [
                {
                    "name": "user_id",
                    "dataType": ["string"]
                },
                {
                    "name": "message",
                    "dataType": ["text"]
                },
                {
                    "name": "timestamp",
                    "dataType": ["date"]
                }
            ]
        }
    ]
}

weaviate_client.schema.create(schema)
