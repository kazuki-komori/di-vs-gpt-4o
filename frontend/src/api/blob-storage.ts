import { BlobServiceClient } from "@azure/storage-blob"

export const BlobStorageAPI = {
  async uploadFile(file: File): Promise<string> {
    try {
      const blobServiceClient = new BlobServiceClient(
        `${import.meta.env.VITE_BLOB_STORAGE_ENDPOINT}?${import.meta.env.VITE_BLOB_STORAGE_SAS_TOKEN}`,
      )

      const containerClient = blobServiceClient.getContainerClient("images")
      const blobClient = containerClient.getBlockBlobClient(file.name)
      await blobClient.uploadData(await file.arrayBuffer())
      return blobClient.url
    } catch (error) {
      console.error(error)
      throw new Error("Failed to upload file")
    }
  },
}
