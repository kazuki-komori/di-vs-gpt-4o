import os

from azure.ai.documentintelligence import DocumentIntelligenceClient
from azure.ai.documentintelligence.models import AnalyzeDocumentRequest
from azure.core.credentials import AzureKeyCredential

from dotenv import load_dotenv

load_dotenv()

DOCUMENT_INTELLIGENCE_API_KEY=os.environ.get("DOCUMENT_INTELLIGENCE_KEY")
DOCUMENT_INTELLIGENCE_ENDPOINT=os.environ.get("DOCUMENT_INTELLIGENCE_ENDPOINT")
print(DOCUMENT_INTELLIGENCE_API_KEY)

document_intelligence_client = DocumentIntelligenceClient(
    endpoint=DOCUMENT_INTELLIGENCE_ENDPOINT,
    credential=AzureKeyCredential(DOCUMENT_INTELLIGENCE_API_KEY),
)


def file_to_text(file_url) -> str:
    return (
        document_intelligence_client.begin_analyze_document(
            "prebuilt-layout",
            locale="ja",
            body=AnalyzeDocumentRequest(url_source=file_url),
            output_content_format="markdown",
        )
        .result()
        .content
    )