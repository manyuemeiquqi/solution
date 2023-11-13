<template>
  <div>
    <!-- <a href="http://localhost:3000/download" @click="handleDownload"> 资源下载 </a> -->
    <button @click="handleClick">下载资源</button>
  </div>
</template>

<script lang="ts" setup>
import axios from 'axios'
const handleDownload = (href: string, fileName: string) => {
  // const aElement = document.createElement('a')
  // aElement.href = href
  // aElement.download = fileName
  // document.body.appendChild(aElement)
  // aElement.click()
  // document.body.removeChild(aElement)

  window.open(href)
}
const getFileLength = () => axios.post('http://localhost:3000/downLength')

const handleClick = () => {
  getFileLength().then((res) => {
    sliceRequest(+res.data).then((chunkList) => {
      const blob = new Blob(
        chunkList.reduce((prev: any[], cur) => {
          return [...prev, cur.data]
        }, [])
      )
      console.log('blob: ', blob)
      const url = URL.createObjectURL(blob)
      // const reader = new FileReader()
      // reader.readAsDataURL(blob)
      // reader.onload = () => {
      //   console.log('reader.result: ', reader.result)
      //   src.value = reader.result as string
      // }
      handleDownload(url, 'a.html')
    })
  })
}

const sliceRequest = (length: number) => {
  const chunkSize = 10 * 1024
  const pLength = Math.ceil(length / chunkSize)
  const pList = new Array(pLength).fill(undefined).map((item, index) => {
    const startRange = chunkSize * index
    const endRange = chunkSize * (index + 1) - 1
    return axios.post(
      'http://localhost:3000/download',
      {},
      {
        headers: {
          Range: `bytes=${startRange}-${endRange}`
        },
        responseType: 'arraybuffer'
      }
    )
  })

  return Promise.all(pList)
}
</script>

<style lang="scss" scoped></style>
