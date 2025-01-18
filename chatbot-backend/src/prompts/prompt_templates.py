def promp_template():
    template="""\
    system:{system_message}
    example: {few_shot_example}
    history:{formatted_history}
    user_info:{formatted_user}
    user:{formatted_user}
    question:{question}
    similar_question:{similar_question}
    answer:\
    """
    return template