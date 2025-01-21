from llama_index.vector_stores.weaviate import WeaviateVectorStore
import weaviate
import yaml

# Load YAML configuration file
def load_config(config_file="../configs/api_keys.yaml"):
    with open(config_file, "r") as file:
        return yaml.safe_load(file)

# Load the OpenAI API key from the YAML file
config = load_config()

cluster_url = config["weaviate"]["url"]
api_key = config["weaviate"]["api_key"]

weaviate_client = weaviate.connect_to_wcs(
    cluster_url=cluster_url,
    auth_credentials=weaviate.auth.AuthApiKey(api_key),
    skip_init_checks=True,
)

def get_weaviate_client () :
    return weaviate_client