from flask import Flask, request
from src import document_intelligence, openai
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# リクエストボディに file URL を受け取り、その URL からテキストを取得して返すエンドポイント
@app.route('/file-to-text', methods=['POST'])
def file_to_text():
    file_url = request.json.get('file_url')
    result = document_intelligence.file_to_text(file_url)
    return result

@app.route("/analyze-file-content", methods=["POST"])
def file_analyze():
    user_prompt = request.json.get("prompt")
    file_content = request.json.get("file_content")
    prompt = f"## 指示\n{user_prompt}OCR による文字起こし結果が与えられますが、文字化けや実在しない住所など間違っているものに関しては適宜修正してください。\n## ファイルの文字起こし\n{file_content}"
    return openai.chat(prompt)

@app.route("/chat-with-image", methods=["POST"])
def chat_with_image():
    user_message = request.json.get("prompt")
    image_url = request.json.get("image_url")
    print(image_url)
    return openai.chat_with_image(user_message, image_url)

if __name__ == '__main__':
    app.run(debug=True)