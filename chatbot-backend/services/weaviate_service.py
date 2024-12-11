
from weaviate import Client, AuthApiKey
from langchain_openai import OpenAIEmbeddings
from utils.config import WEAVIATE_URL, WEAVIATE_API_KEY
from langchain.schema import AIMessage, HumanMessage



OPENAI_API_KEY = "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"
print(WEAVIATE_URL," " ,WEAVIATE_API_KEY)
# Configure the Weaviate client with API key authentication
auth_config = AuthApiKey(api_key=WEAVIATE_API_KEY)
weaviate_client = Client(
    url=WEAVIATE_URL,  # Sandbox instance URL
    auth_client_secret=auth_config  # Use the API key for authentication
)
print(weaviate_client.is_ready())  # Should return True if connected successfully.

embeddings = OpenAIEmbeddings(model="text-embedding-3-large", api_key=OPENAI_API_KEY)

# Ensure schema exists
# def ensure_schema():
#     schema = {
#         "class": "ChatHistory",
#         "properties": [
#             {"name": "text", "dataType": ["text"]},
#             {"name": "user_id", "dataType": ["string"]},
#         ],
#     }
#     weaviate_client.schema.create_class(schema)

# def add_to_vectorstore(message, user_id):
#     embedding = embeddings.embed(message)
#     weaviate_client.data_object.create(
#         {
#             "message": message,  # "message" should match the schema
#             "user_id": user_id,  # "user_id" should match the schema
#         },
#         class_name="ChatHistory",
#         vector=embedding,
#     )
# def add_to_vectorstore(message, user_id):
#     print(OPENAI_API_KEY)
#     embedding = embeddings.embed_query(message)  # Use embed_query() instead of embed()
#     weaviate_client.data_object.create(
#         {
#             "message": message,  # "message" should match the schema
#             "user_id": user_id,  # "user_id" should match the schema
#         },
#         class_name="ChatHistory",
#         vector=embedding,
#     )
def add_to_vectorstore(message, user_id):
    # If the message is an instance of AIMessage or HumanMessage, extract the content
    if isinstance(message, (AIMessage, HumanMessage)):
        message = message.content  # Extract the content part of the message

    # Generate embedding using embed_query
    embedding = embeddings.embed_query(message)
    
    weaviate_client.data_object.create(
        {
            "message": message,  # "message" should now be a string
            "user_id": user_id,  # "user_id" should match the schema
        },
        class_name="ChatHistory",
        vector=embedding,
    )
def query_vectorstore(query, user_id):
    result = weaviate_client.query.get(
        "ChatHistory",  # The class name is ChatHistory
        ["user_id", "message", "timestamp"],  # Correct field names from your schema
    ).with_where({
        "path": ["user_id"],  # Filtering by user_id
        "operator": "Equal",  # Equality operator
        "valueString": user_id  # The value to match
    }).do()

    print(result)
    return result["data"]["Get"]["ChatHistory"]  # Adjusted to match the schema


