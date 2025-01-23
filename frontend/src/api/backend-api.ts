export const BackendAPI = {
  async file2text(fileURL: string): Promise<string> {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_API_ENDPOINT}/file-to-text`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ file_url: fileURL }),
        },
      )
      const text = await response.text()
      return text
    } catch (error) {
      console.error(error)
      throw new Error("Failed to convert file to text")
    }
  },

  async analyzeFileContent(
    prompt: string,
    file_content: string,
  ): Promise<string> {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_API_ENDPOINT}/analyze-file-content`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ prompt, file_content }),
        },
      )
      const result = await response.text()
      return result
    } catch (error) {
      console.error(error)
      throw new Error("Failed to analyze file content")
    }
  },

  async chatWithImage(prompt: string, image_url: string) {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_API_ENDPOINT}/chat-with-image`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ prompt, image_url }),
        },
      )
      const result = await response.text()
      return result
    } catch (error) {
      console.error(error)
      throw new Error("Failed to chat with image")
    }
  },
}
