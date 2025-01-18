import json
from typing import Sequence, List

from llama_index.llms.openai import OpenAI
from llama_index.core.llms import ChatMessage
from llama_index.core.tools import BaseTool, FunctionTool
from openai.types.chat import ChatCompletionMessageToolCall
from llama_index.agent.openai import OpenAIAgent
from llama_index.core import PromptTemplate
from core.ai.database import get_recent_chat_history, format_chat_history, get_user_info, format_user_info

from .prompts.fewshot_prompts import few_shot_example
from .prompts.prompt_templates import prompt_template
from .prompts.user_prompts import user_info_prompt
from .prompts.similar_question_prompts import similar_question_prompt
from .prompts.system_prompts import system_message_prompt

import nest_asyncio

nest_asyncio.apply()

OPENAI_API_KEY ="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"

# define pydantic model for auto-retrieval function
class AutoRetrieveModel(BaseModel):
    query: str = Field(..., description="natural language query string")
    filter_key_list: List[str] = Field(
        ..., description="List of metadata filter field names"
    )
    filter_value_list: List[Any] = Field(
        ...,
        description=(
            "List of metadata filter field values (corresponding to names"
            " specified in filter_key_list)"
        ),
    )
    filter_operator_list: List[str] = Field(
        ...,
        description=(
            "Metadata filters conditions (could be one of <, <=, >, >=, ==, !=)"
        ),
    )
    filter_condition: str = Field(
        ...,
        description=("Metadata filters condition values (could be AND or OR)"),
    )


description = f"""\
Use this tool to look up biographical information about celebrities.
The vector database schema is given below:
{vector_store_info.json()}
"""

# Create tools
retrieveMongoTool = 
# retrieveNutritionTool = 
# retrieveSymptomTool = 
# retrieveTreatmentTool = 
retrieveLifeBMIBloodTool = 
# Define a tool 
tool = [retrieveMongoTool, 
        # retrieveNutritionTool, 
        # retrieveSymptomTool, 
        # retrieveTreatmentTool, 
        retrieveLifeBMIBloodTool
        ]

        
def get_llm_and_agent():
    """
    Hàm khởi tạo LLM và Agent
    """
    
    chat = OpenAI(
    temperature=0, 
    streaming=True, 
    model="gpt-4o-mini", 
    api_key=OPENAI_API_KEY,
    )
    tools = []
    
    prompt = 
    
    agent = OpenAIAgent.from_tools(
    tools,
    prompt,
    llm=OpenAI(temperature=0, model="gpt-4-0613"),
    verbose=True,
)
    
    return agent


async def get_answer_stream(question: str, chat_id: str, user_id: str):
    """
    Hàm lấy câu trả lời dạng stream cho một câu hỏi
    
    Quy trình xử lý:
    1. Khởi tạo agent với các tools cần thiết
    2. Lấy lịch sử chat gần đây
    3. Gọi agent để xử lý câu hỏi
    4. Stream từng phần của câu trả lời về client
    5. Lưu câu trả lời hoàn chỉnh vào database
    
    Args:
        question (str): Câu hỏi của người dùng
        thread_id (str): ID phiên chat
        
    Returns:
        AsyncGenerator[str, None]: Generator trả về từng phần của câu trả lời
    """
    # Khởi tạo agent với các tools cần thiết
    agent = get_llm_and_agent()
    query_gen_str = """\
    You are a helpful assistant that generates multiple search queries based on a \
    single input query. Generate {num_queries} search queries, one on each line, \
    related to the following input query:
    Query: {query}
    Queries:
    """
    query_gen_prompt = PromptTemplate(query_gen_str)

    llm = OpenAI(model="gpt-3.5-turbo")


    def generate_queries(query: str, llm, num_queries: int = 4):
        response = llm.predict(
            query_gen_prompt, num_queries=num_queries, query=query
        )
        # assume LLM proper put each query on a newline
        queries = response.split("\n")
        queries_str = "\n".join(queries)
        print(f"Generated queries:\n{queries_str}")
        return queries
    
    queries = generate_queries("What happened at Interleaf and Viaweb?", llm)
    
    # Lấy lịch sử chat gần đây
    history = get_recent_chat_history(thread_id)
    chat_history = format_chat_history(history)
    
    # Biến lưu câu trả lời hoàn chỉnh
    final_answer = ""
    
    # Stream từng phần của câu trả lời
    async for event in agent.astream_events(
        {
            "input": question,
            "chat_history": chat_history,
        },
        version="v2"
    ):       
        # Lấy loại sự kiện
        kind = event["event"]
        # Nếu là sự kiện stream từ model
        if kind == "on_chat_model_stream":
            # Lấy nội dung token
            content = event['data']['chunk'].content
            if content:  # Chỉ yield nếu có nội dung
                # Cộng dồn vào câu trả lời hoàn chỉnh
                final_answer += content
                # Trả về token cho client
                yield content


if __name__ == "__main__":
    import asyncio
    
    async def test():
        # answer = get_answer_stream("hi", "test-session")
        # print(answer)
        async for event in get_answer_stream("hi", "test-session"):
            print('event:', event)
        print('done')

    
    asyncio.run(test())
