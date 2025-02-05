import {
  Box,
  Button,
  Center,
  Container,
  FileButton,
  Paper,
  SimpleGrid,
  Space,
  Text,
  Textarea,
  Title,
} from "@mantine/core"
import {
  IconClearFormatting,
  IconFileAnalytics,
  IconFileUpload,
} from "@tabler/icons-react"
import MarkdownIt from "markdown-it"
import { useState } from "react"
import "@/assets/styles/markdown.css"

import { BackendAPI } from "@/api/backend-api"
import { BlobStorageAPI } from "@/api/blob-storage"
export const TopPage = () => {
  const [file, setFile] = useState<File | null>(null)
  const [prompt, setPrompt] = useState<string>(
    "markdown 形式で表を抽出してください。",
  )
  const [documentIntelligenceResult, setDocumentIntelligenceResult] =
    useState<string>("")
  const [gpt4oResult, setGpt4oResult] = useState<string>("")
  const [gpt4oDocumentIntelligenceResult, setGpt4oDocumentIntelligenceResult] =
    useState<string>("")
  const [isLoading, setIsLoading] = useState(false)

  const resetResult = () => {
    setDocumentIntelligenceResult("")
    setGpt4oResult("")
    setGpt4oDocumentIntelligenceResult("")
  }

  const startProcessing = async () => {
    if (!file) return

    setIsLoading(true)
    const fileURL = await BlobStorageAPI.uploadFile(file)
    const file2text = await BackendAPI.file2text(fileURL)
    console.log("file2text done")
    const GPT4oResult = await BackendAPI.chatWithImage(prompt, fileURL)
    setGpt4oResult(GPT4oResult)

    const documentIntelligenceResult = await BackendAPI.analyzeFileContent(
      prompt,
      file2text,
    )
    setDocumentIntelligenceResult(documentIntelligenceResult)

    const GPT4oDocumentIntelligenceResult = await BackendAPI.chatWithImage(
      `${prompt}\nOCR による文字起こし結果が与えられますが、文字化けや存在しない住所など明らかに間違っているものに関しては、添付の画像を参考に適宜修正してください。\n## 文字起こし結果\n${file2text}`,
      fileURL,
    )
    setGpt4oDocumentIntelligenceResult(GPT4oDocumentIntelligenceResult)
    setIsLoading(false)
  }

  return (
    <>
      <Container py={128} maw={1600}>
        <Title order={2}>ファイル分析 Document Intelligence + gpt-4o</Title>
        <Space h={64} />
        <Text fz={"sm"} fw={"bold"} c={"gray.7"}>
          ファイルをアップロード
        </Text>
        <Space h={8} />
        <FileButton onChange={setFile}>
          {(props) => (
            <Button
              px={64}
              variant="outline"
              leftSection={<IconFileUpload />}
              {...props}
            >
              ファイルを選択
            </Button>
          )}
        </FileButton>
        <Space h={8} />
        <Text c={"gray.7"}>{file?.name}</Text>
        <Space h={48} />
        <Text fz={"sm"} fw={"bold"} c={"gray.7"}>
          プロンプト
        </Text>
        <Space h={8} />
        <Textarea
          value={prompt}
          onChange={(event) => setPrompt(event.currentTarget.value)}
          size="lg"
          placeholder="ファイルの内容を元に、表を抽出してください。"
        />
        <Space h={48} />
        <Center>
          {gpt4oResult || documentIntelligenceResult ? (
            <Button
              loading={isLoading}
              onClick={() => resetResult()}
              px={36}
              leftSection={<IconClearFormatting />}
            >
              結果をリセット
            </Button>
          ) : (
            <Button
              disabled={!file}
              loading={isLoading}
              onClick={() => startProcessing()}
              px={64}
              leftSection={<IconFileAnalytics />}
            >
              分析開始
            </Button>
          )}
        </Center>

        {/* 結果 */}
        <Box mt={64}>
          <SimpleGrid cols={2}>
            <Paper p="lg" bg={"gray.1"} withBorder>
              <Text fz={"lg"} fw={"bold"} c={"gray.9"}>
                gpt-4o 画像認識
              </Text>
              <Space h={16} />
              <Text
                className="markdown"
                dangerouslySetInnerHTML={{
                  __html: MarkdownIt().render(gpt4oResult),
                }}
              />
            </Paper>
            <Paper p="lg" bg={"gray.2"} withBorder>
              <Text fz={"lg"} fw={"bold"} c={"gray.9"}>
                Document Intelligence
              </Text>
              <Space h={16} />
              <Text
                className="markdown"
                dangerouslySetInnerHTML={{
                  __html: MarkdownIt().render(documentIntelligenceResult),
                }}
              />
            </Paper>
            <Paper p="lg" bg={"gray.2"} withBorder>
              <Text fz={"lg"} fw={"bold"} c={"gray.9"}>
                gpt-4o 画像認識 + Document Intelligence
              </Text>
              <Space h={16} />
              <Text
                className="markdown"
                dangerouslySetInnerHTML={{
                  __html: MarkdownIt().render(gpt4oDocumentIntelligenceResult),
                }}
              />
            </Paper>
          </SimpleGrid>
        </Box>
      </Container>
    </>
  )
}
