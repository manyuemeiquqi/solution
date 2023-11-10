<template>
  <div>
    <input @change="handleFileChange" type="file" />

    <button @click="handleUpload">上传</button>
    <button @click="handlePause">暂停</button>
    <button @click="handleResume">恢复上传</button>
    <span>进度 {{ totalPercent }}</span>
    <ul v-for="(item, index) in chunkList" :key="index">
      <li>{{ item.chunkName }} 上传进度 {{ item.percent }}/100</li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import axios from 'axios'
import { computed, ref, toRaw } from 'vue'
import { calculateHash, getHashFileName } from './upload'
interface FileChunk {
  chunk: Blob
  index: number
  percent: number
  size: number
  fileName: string
  chunkName: string
}
const chunkSize = 2 * 1024 * 1024
let chunkList = ref<FileChunk[]>([])
const totalPercent = computed(() => {
  return (
    chunkList.value.reduce((prev, cur) => {
      return prev + cur.percent
    }, 0) /
    chunkList.value.length /
    100
  )
})
const handleFileChange = (e: Event) => {
  const file = (e.target as EventTarget & { files: FileList }).files[0]
  // 2MB
  // 1024 byte 1KB 1024KB 1MB
  const fileList: Pick<FileChunk, 'chunk'>[] = []
  let cur = 0
  while (cur < file.size) {
    fileList.push({
      chunk: file.slice(cur, cur + chunkSize) //使用slice()进行切片
    })

    cur += chunkSize
  }

  chunkList.value = fileList.map(({ chunk }, index) => {
    return {
      chunk,
      size: file.size,
      index,
      percent: 0,
      fileName: file.name,
      chunkName: `${file.name}-${index}`
    }
  })
  // 浏览器读取跟切片的速度是非常快的，1GB文件也就几百毫秒就完成了chunklist
}
let fileHash = ''
const abortControl = new AbortController()

const uploadFile = async (chunkList: FileChunk[]) => {
  // Promise.all
  // worker 的 onmessage 传递数据需要用原始对象进行传递，否则会发生错误
  // 整个文件的hash
  fileHash = await calculateHash(toRaw(chunkList))
  const verifyRes = await verifyFileExist(getHashFileName(fileHash, chunkList[0].fileName))
  console.log('verifyRes: ', verifyRes.data.hasFile)
  if (verifyRes.data.hasFile) {
    return new Error('已经存在该文件')
  }

  const pList = chunkList.map((chunk, index) => {
    const params = new FormData()
    const hashName = getHashFileName(fileHash, chunk.fileName)
    params.append('file', chunk.chunk)
    params.append('fileName', hashName)
    params.append('chunkName', getHashFileName(fileHash, `${hashName}-${index}`))
    return axios.post('http://localhost:3000/upload', params, {
      signal: abortControl.signal,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total) chunk.percent = (progressEvent.loaded / progressEvent.total) * 100
        // console.log(`Upload progress: ${Math.round(progress * 100)}%`)
      }
    })
  })
  return Promise.all(pList)
}

const handleResume = async () => {
  const fileHashName = getHashFileName(fileHash, chunkList.value[0].fileName)
  // const fileHashName = 'b31919bd8d88c56dcac1cd9cbd10c99b.dat'
  const verifyRes = await verifyFileExist(fileHashName)
  console.log('verifyRes: ', verifyRes.data.hasFile)

  const hasUploadedList = verifyRes.data.list
  const pList = chunkList.value
    .filter((chunk, index) => {
      if (
        hasUploadedList.find((item: string) => item === `${fileHashName}-${index}`) === undefined
      ) {
        return true
      } else {
        chunkList.value[chunk.index].percent = 100
        return false
      }
    })
    .map((chunk, index) => {
      const params = new FormData()
      const hashName = getHashFileName(fileHash, chunk.fileName)
      params.append('file', chunk.chunk)
      params.append('fileName', hashName)
      params.append('chunkName', getHashFileName(fileHash, `${hashName}-${chunk.index}`))
      return axios.post('http://localhost:3000/upload', params, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total)
            chunk.percent = (progressEvent.loaded / progressEvent.total) * 100
          // console.log(`Upload progress: ${Math.round(progress * 100)}%`)
        }
      })
    })
  Promise.all(pList)
    .then((uploadRes) => {
      console.log('uploadRes: ', uploadRes)
      const params = {
        fileName: getHashFileName(fileHash, chunkList.value[0].fileName),
        size: chunkSize
      }

      axios
        .post('http://localhost:3000/merge', JSON.stringify(params))
        .then((res) => {
          alert('上传成功')
        })
        .catch()
    })
    .catch()
}

const handleUpload = async () => {
  uploadFile(chunkList.value)
    .then((uploadRes) => {
      console.log('uploadRes: ', uploadRes)
      const params = {
        fileName: getHashFileName(fileHash, chunkList.value[0].fileName),
        size: chunkSize
      }

      axios
        .post('http://localhost:3000/merge', JSON.stringify(params))
        .then((res) => {
          alert('上传成功')
        })
        .catch()
    })
    .catch()
}
const verifyFileExist = (fileHashName: string) =>
  axios.post('http://localhost:3000/verify', JSON.stringify({ fileName: fileHashName }), {
    headers: {
      'Content-Type': 'application/json'
    }
  })

const handlePause = () => {
  abortControl.abort()
}
</script>

<style scoped lang="scss"></style>
