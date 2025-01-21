from tonic_validate import Benchmark, ValidateApi, ValidateScorer

# Function to simulate getting a response and context from your LLM
# Replace this with your actual function call
def get_rag_response(question):
    return {
        "llm_answer": "Paris",
        "llm_context_list": ["Paris is the capital of France."]
    }

benchmark = Benchmark(questions=["What is the capital of France?"], answers=["Paris"])
# Score the responses for each question and answer pair
scorer = ValidateScorer()
run = scorer.score(benchmark, get_rag_response)
validate_api = ValidateApi("BolA82HRkDKErlxQUwsLeN59Ijv3sioBlABG_3a1EDY")
validate_api.upload_run("8c967333-6db7-4b3d-9c1a-d9f5e5595a18", run)