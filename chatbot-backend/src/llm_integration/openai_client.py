from llama_index.llms.openai import OpenAI
import yaml
import os 
import openai

# Load YAML configuration file
def load_config(config_file="../configs/api_keys.yaml"):
    with open(config_file, "r") as file:
        return yaml.safe_load(file)

# Load the OpenAI API key from the YAML file
config = load_config()
openai.api_key = config["openai"]["api_key"]

llmTitle = OpenAI(        
        temperature=0.2,
        model="gpt-4o-mini",
        api_key=config["openai"]["api_key"])

llmAgent = OpenAI(
        temperature=0,
        model="gpt-4o-mini",
        api_key=config["openai"]["api_key"])

llmRetriever = OpenAI(
        temperature=0,
        model="gpt-4o-mini",
        api_key=config["openai"]["api_key"])

llmTransform = OpenAI(
        temperature=0.2,
        model="gpt-4o-mini",
        api_key=config["openai"]["api_key"])


def get_llmTitle():
    return llmTitle

def get_llmAgent():
    return llmAgent

def get_llmRetriever():
    return llmRetriever

def get_llmTransform():
    return llmTransform