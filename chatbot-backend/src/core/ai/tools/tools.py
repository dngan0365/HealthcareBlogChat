from llama_index.core.tools import FunctionTool
from llama_index.core.vector_stores import (
    VectorStoreInfo,
    MetadataInfo,
    MetadataFilter,
    MetadataFilters,
    FilterCondition,
    FilterOperator,
)
from llama_index.core.retrievers import VectorIndexRetriever
from llama_index.core.query_engine import RetrieverQueryEngine
import weaviate

from llama_index.core import VectorStoreIndex, SimpleDirectoryReader
from llama_index.vector_stores.weaviate import WeaviateVectorStore
from IPython.display import Markdown, display

from typing import List, Tuple, Any
from pydantic import BaseModel, Field

# hardcode top k for now
top_k = 5


# define vector store index
cluster_url = "https://wly3tkm2tkewvzycwne6fa.c0.asia-southeast1.gcp.weaviate.cloud"
api_key = "ruGxCkA145k9qWxpoycebKHeLGxc9vtCnLWZ"

client = weaviate.connect_to_wcs(
    cluster_url=cluster_url,
    auth_credentials=weaviate.auth.AuthApiKey(api_key),
)

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

def RetrieveLifeBMIBloodTool(
    query: str,
    filter_key_list: List[str],
    filter_value_list: List[any],
    filter_operator_list: List[str],
    filter_condition: str,
):
    """
    Hàm truy vấn thông tin về lịch sử BMI và máu
    """
    # Define the vector store

    vector_store = WeaviateVectorStore(
        weaviate_client=client, index_name="Chi_so_co_the_BMI"
    )

    loaded_index = VectorStoreIndex.from_vector_store(vector_store)
    
    # define vector store info describing schema of vector store
    vector_store_info = VectorStoreInfo(
        content_info="brief biography of celebrities",
        metadata_info=[
            MetadataInfo(
                name="category",
                type="str",
                description=(
                    "Category of the celebrity, one of [Sports, Entertainment,"
                    " Business, Music]"
                ),
            ),
            MetadataInfo(
                name="country",
                type="str",
                description=(
                    "Country of the celebrity, one of [United States, Barbados,"
                    " Portugal]"
                ),
            ),
            MetadataInfo(
                name="gender",
                type="str",
                description=("Gender of the celebrity, one of [male, female]"),
            ),
            MetadataInfo(
                name="born",
                type="int",
                description=("Born year of the celebrity, could be any integer"),
            ),
        ],
    )
    
    """Auto retrieval function.

    Performs auto-retrieval from a vector database, and then applies a set of filters.

    """
    query = query or "Query"

    metadata_filters = [
        MetadataFilter(key=k, value=v, operator=op)
        for k, v, op in zip(
            filter_key_list, filter_value_list, filter_operator_list
        )
    ]
    retriever = VectorIndexRetriever(
        index,
        filters=MetadataFilters(
            filters=metadata_filters, condition=filter_condition
        ),
        top_k=top_k,
    )
    query_engine = RetrieverQueryEngine.from_args(retriever)

    response = query_engine.query(query)
    return str(response)