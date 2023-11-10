export const calculateHash = async (chunkList: any[]) => {
  const p: Promise<string> = new Promise((resolve) => {
    const worker = new Worker('/hashWorker.js')
    worker.postMessage({ fileChunkList: chunkList })
    worker.onmessage = (event) => {
      if (event.data.hash) resolve(event.data.hash as string)
    }
  })
  return p
}

export const getHashFileName = (hash: string, fileName: string) => {
  const lastDotIndex = fileName.lastIndexOf('.')
  if (lastDotIndex === -1) {
    return `${hash}`
  }
  const extension = fileName.slice(lastDotIndex + 1)
  return `${hash}.${extension}`
}
