import json
import yaml
import os
import csv
import time as tm
from datetime import date, time, datetime
import nest_asyncio
from typing import Sequence, List
from openai.types.chat import ChatCompletionMessageToolCall
from llama_index.llms.openai import OpenAI
from llama_index.agent.openai import OpenAIAgent

from llama_index.core.llms import ChatMessage
from llama_index.core.tools import BaseTool, FunctionTool
from openai.types.chat import ChatCompletionMessageToolCall
from llama_index.core import PromptTemplate
from functools import partial
from typing import List, Tuple, Any
from pydantic import BaseModel, Field

from core.ai.database.chat_history_service import get_recent_chat_history, format_chat_history, get_user_info
from prompts.prompt_templates import prompt_template
from prompts.system_prompts import system_prompt
from core.ai.tools.tools import RetrieveMongoTool, RetrieveLifeBMIBloodTool, RetrieveBenhNoiKhoa, RetrieveDinhDuong, RetrieveQuestionAnswer, RetrieveTamLy
from llm_integration.openai_client import get_llmAgent, get_llmTransform

nest_asyncio.apply()

# Load YAML configuration file
# Load YAML configuration file
def load_config(config_file="../configs/api_keys.yaml"):
    with open(config_file, "r") as file:
        return yaml.safe_load(file)


# Check and write to the next available empty row
def write_to_next_empty_row(data, file_name):
    with open(file_name, mode="a", newline="", encoding="utf-16") as file:
        writer = csv.writer(file, quotechar='"', quoting=csv.QUOTE_MINIMAL)
        writer.writerow(data)  # Append the row to the end of the file

template = prompt_template()
# Load YAML configuration file
def load_config(config_file="../configs/api_keys.yaml"):
    with open(config_file, "r") as file:
        return yaml.safe_load(file)

# Load the OpenAI API key from the YAML file
config = load_config()
os.environ["OPENAI_API_KEY"] = config["openai"]["api_key"]
OPENAI_API_KEY = config["openai"]["api_key"]
class RetrieveModel(BaseModel):
    query: str = Field(..., description="Câu truy vấn của người dùng bằng ngôn ngữ tự nhiên")

class ScheduleRetrieveModel(BaseModel):
    query: str = Field(..., description="Câu truy vấn của người dùng bằng ngôn ngữ tự nhiên")
    filter_start_date: date = Field(
        ...,
        description=(
            "Ngày bắt đầu của sự kiện trong lịch trình dạng YYYY-MM-DD"
        ),
    )
    filter_start_time: time = Field(
        ...,
        description=(
            "Thời gian bắt đầu của sự kiện trong lịch trình dạng HH:MM"
        ),
    )
    filter_end_date: date = Field(
        ...,
        description=(
            "Ngày kết thúc của sự kiện trong lịch trình dạng YYYY-MM-DD"
        ),
    )
    filter_end_time: time = Field(
        ...,
        description=(
            "Thời gian kết thúc của sự kiện trong lịch trình dạng HH:MM"
        ),
    )


descriptionLifeBMIBlood = f"""Sử dụng tool này để tra cứu thông tin về các chỉ số của cơ thể như cân nặng, chiều cao, BMI, máu, các từ viết tắt trong y khoa và chế độ ăn uống, tập thể dục, lối sống lành mạnh."""

descriptionMongo = f"""Hữu ý trong việc lấy thông tin lịch trình, kế hoạch của người dùng. Hôm nay là ngày {date.today().strftime('%Y-%m-%d')}  và hiện tại là {datetime.now().strftime('%H:%M')} giờ (sử dụng để nói về hiện tại)"""
descirptionBenhNoiKhoa = f"""Hữu ý trong việc tìm kiếm thông tin về các triệu chứng, chẩn đoán và phòng ngừa và cách chữa trị các bệnh nội khoa."""
descriptionTamlLy = f"""Hữu ý trong việc tìm kiếm thông tin về tâm lý vị thành niên. """
descirptionDinhDuong = f"""Hữu ý trong việc tìm kiếm thông tin về dinh dưỡng, thực phẩm."""
descriptionQA = f"""Những câu hỏi thường gặp và có câu trả lời và những bệnh thường gặp và biểu hiện, cách phòng tránh."""
# Create tools

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
        chat_id (str): ID phiên chat
        
    Returns:
        AsyncGenerator[str, None]: Generator trả về từng phần của câu trả lời
    """
    # write_to_next_empty_row([question], "tools_log.csv")
    
    chat = get_llmAgent()

    retrieveLifeBMIBloodTool = FunctionTool.from_defaults(
        fn=RetrieveLifeBMIBloodTool,
        name="bmi_blood_symbol_lifestyle",
        description=descriptionLifeBMIBlood,
        fn_schema=RetrieveModel,
    )
    retrieveBenhNoiKhoa = FunctionTool.from_defaults(
        fn=RetrieveBenhNoiKhoa,
        name="benh_noi_khoa",
        description=descirptionBenhNoiKhoa,
        fn_schema=RetrieveModel,
    )
    retrieveDinhDuong = FunctionTool.from_defaults(
        fn=RetrieveDinhDuong,
        name="dinh_duong",
        description=descirptionDinhDuong,
        fn_schema=RetrieveModel,
    )
    retrieveTamLy = FunctionTool.from_defaults(
        fn=RetrieveTamLy,
        name="tam_ly",
        description=descriptionTamlLy,
        fn_schema=RetrieveModel,
    )
    retrieveQuestionAnswer = FunctionTool.from_defaults(
        fn=RetrieveQuestionAnswer,
        name="question_answer",
        description=descriptionQA,
        fn_schema=RetrieveModel,
    )
    retrieveMongoTool = FunctionTool.from_defaults(
        fn=partial(RetrieveMongoTool, user_id=user_id),
        name="schedule",
        description=descriptionMongo,
        fn_schema=ScheduleRetrieveModel,
    )

    get_system_prompt = system_prompt()
    
    # Define a tool 
    tools = [retrieveLifeBMIBloodTool, retrieveMongoTool, retrieveBenhNoiKhoa, retrieveDinhDuong, retrieveTamLy, retrieveQuestionAnswer]

    # Validate that 'tools' does not contain any null or invalid content
    agent = OpenAIAgent.from_tools(
        tools,
        llm=chat,
        verbose=True,
        system_prompt=get_system_prompt,
        api_key=OPENAI_API_KEY,
    )

    query_gen_str = """\
Bạn là một trợ lý hữu ích, có nhiệm vụ tạo ra nhiều câu truy vấn tìm kiếm dựa trên một truy vấn đầu vào (câu input có thể khó hiểu và sai chính tả, nhập sai kí tự).  
Hãy tạo ra {num_queries} truy vấn tìm kiếm (dễ hiểu, dễ truy vấn, khắc phụ các lỗi sai), mỗi truy vấn trên một dòng, liên quan (cùng nghĩa) đến truy vấn đầu vào sau đây:
Query: {query}
Queries:
    """
    query_gen_prompt = PromptTemplate(query_gen_str)

    llm = get_llmTransform()

    # Lấy lịch sử chat gần đây
    history = get_recent_chat_history(chat_id)
    chat_history = format_chat_history(history)
    user_info = get_user_info(user_id)  # Chuyển sang async gọi
    
    def generate_queries(query: str, llm, num_queries: int = 3):
        response = llm.predict(
            query_gen_prompt, num_queries=num_queries, query=query
        )
        # assume LLM proper put each query on a newline
        queries = response.split("\n")
        return queries
    
    queries = generate_queries(question, llm)  # Chuyển sang async gọi
    
    prompt = PromptTemplate(
        template=template, 
        function_mappings={
            "formatted_history":  lambda: str(chat_history),
            "formatted_user": lambda: str(user_info),
            "question": lambda: question,
            "similar_question": lambda: "\n".join(queries),
        }
    )
    # Tạo nội dung hoàn chỉnh bằng cách gọi các hàm trong `function_mappings`
    rendered_prompt = prompt.template.format(
        formatted_history=prompt.function_mappings["formatted_history"](),
        formatted_user=prompt.function_mappings["formatted_user"](),
        question=prompt.function_mappings["question"](),
        similar_question=prompt.function_mappings["similar_question"](),
    )

    # In nội dung đã thay thế
    #print(rendered_prompt)
    
    start_time=tm.time()
    response = agent.stream_chat(rendered_prompt)
    end_time=tm.time()
    
    elapsed_time=end_time-start_time
    print("response: ", response)
    response_gen = response.response_gen
    # Stream từng phần của câu trả lời
    gpt_response_parts = []
    for token in response_gen:
        print("chunk: ", token)
        yield token
        gpt_response = "".join(gpt_response_parts)

    # write_to_next_empty_row([question, queries, gpt_response, elapsed_time], "eval.csv")
    
    

if __name__ == "__main__":
    import asyncio
    
    async def test():
        # answer = get_answer_stream("hi", "test-session")
        # print(answer)
        async for event in get_answer_stream("hi", "test-session", "user-id"):
            print('event:', event)
        print('done')

    asyncio.run(test())
