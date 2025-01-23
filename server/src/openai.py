import os
from openai import AzureOpenAI

def chat(user_message: str):
    openai_client = AzureOpenAI(
        azure_endpoint=os.environ.get("AZURE_OPENAI_ENDPOINT"),
        api_key=os.environ.get("AZURE_OPENAI_API_KEY"),
        api_version="2024-08-01-preview"
    )
    system_prompt = """
    あなたは与えられるファイルの中身を元に、ユーザーからの要求に応じてテキストを生成するシステムです。
    求められた内容以外は回答しないでください。レスポンスは markdown 形式で、コードブロックは使わないでください。
    """
    response = openai_client.chat.completions.create(
        model="gpt-4o",
        messages=[{"role": "system", "content": system_prompt}, {"role": "user", "content": user_message}],
        stream=False,
    )

    return response.choices[0].message.content


def chat_with_image(user_message: str, image_url: str):
    openai_client = AzureOpenAI(
        azure_endpoint=os.environ.get("AZURE_OPENAI_ENDPOINT"),
        api_key=os.environ.get("AZURE_OPENAI_API_KEY"),
        api_version="2024-08-01-preview"
    )
    system_prompt = """
    あなたは与えられる画像を元に、ユーザーからの要求に応じてテキストを生成するシステムです。
    余分な情報を含めないように注意してください。レスポンスは markdown 形式で、コードブロックは使わないでください。
    """
    response = openai_client.chat.completions.create(
        model="gpt-4o",
        messages=[{"role": "system", "content": system_prompt}, {"role": "user", "content": [{"type": "text", "text": user_message}, {"type": "image_url", "image_url": { "url": image_url}}]},],
        stream=False,
    )

    return response.choices[0].message.content