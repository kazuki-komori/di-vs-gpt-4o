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
import { IconFileAnalytics, IconFileUpload } from "@tabler/icons-react"
import MarkdownIt from "markdown-it"
import { useState } from "react"
import "@/assets/styles/markdown.css"

import { BackendAPI } from "@/api/backend-api"
import { BlobStorageAPI } from "@/api/blob-storage"
export const TopPage = () => {
  const [file, setFile] = useState<File | null>(null)
  const [prompt, setPrompt] = useState<string>("")
  const [documentIntelligenceResult, setDocumentIntelligenceResult] =
    useState<string>("")
  const [gpt4oResult, setGpt4oResult] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)

  const startProcessing = async () => {
    if (!file) return

    setIsLoading(true)
    const fileURL = await BlobStorageAPI.uploadFile(file)
    const result = await BackendAPI.file2text(fileURL)
    console.log("file2text done")
    const documentIntelligenceResult = await BackendAPI.analyzeFileContent(
      prompt,
      result,
    )
    const GPT4oResult = await BackendAPI.chatWithImage(prompt, fileURL)
    setGpt4oResult(GPT4oResult)
    setDocumentIntelligenceResult(documentIntelligenceResult)
    setFile(null)
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
          onChange={(event) => setPrompt(event.currentTarget.value)}
          size="lg"
          placeholder="ファイルの内容を元に、表を抽出してください。"
        />
        <Space h={48} />
        <Center>
          <Button
            loading={isLoading}
            onClick={() => startProcessing()}
            px={64}
            leftSection={<IconFileAnalytics />}
          >
            分析開始
          </Button>
        </Center>

        {/* 結果 */}
        <Box mt={64}>
          <SimpleGrid cols={2}>
            <Paper p="lg" bg={"gray.1"} withBorder>
              <Text fz={"lg"} fw={"bold"} c={"gray.9"}>
                gpt-4o のみで分析
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
                gpt-4o + Document Intelligence で分析
              </Text>
              <Space h={16} />
              <Text
                className="markdown"
                dangerouslySetInnerHTML={{
                  __html: MarkdownIt().render(documentIntelligenceResult),
                }}
              />
            </Paper>
          </SimpleGrid>
        </Box>
      </Container>
    </>
  )
}
