<template>
  <div
    ref="container"
    :style="{
      height: props.containerHeight + 'px',
      overflow: 'scroll',
      position: 'relative'
    }"
    @scroll="handleScroll"
  >
    <div
      :style="{
        height: listHeight - listTopOffset + 'px',
        marginTop: listTopOffset + 'px'
      }"
    >
      <div
        v-for="(item, index) in currentList"
        :style="{
          height: props.itemHeight + 'px'
        }"
        :key="index"
      >
        {{ item }}
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onBeforeMount, ref } from 'vue'

interface Props {
  source: any[]
  itemHeight: number
  containerHeight: number
}
const props = defineProps<Props>()

const listHeight = props.source.length * props.itemHeight
const listLength = Math.ceil(props.containerHeight / props.itemHeight)
const container = ref<HTMLDivElement | null>(null)
let listTopOffset = 0

// scrollTop 获取元素内容高度距离垂直滚动的像素值
// 此外还有一个需要考虑的难点，container 是固定高度的，但是 content 的虽然 dom 只限制为少数个，但是其高度还是需要设置为传入props.source* 高度，用来撑开容器
// 撑开之后,还有一个要注意的点,就是如何要渲染的区域究竟在哪里,
// 视觉上开发者要将渲染区域固定在容器顶部,
// 有两种方式,一种 通过定位,另外一种通过 height+ margintop相配合

const handleScroll = () => {
  const topOffset = container.value!.scrollTop
  const startIdx = (topOffset / props.itemHeight) >> 0
  updateCurrentList(startIdx)
}

function updateCurrentList(idx: number) {
  currentList.value = props.source.slice(idx, idx + listLength)
  listTopOffset = idx * props.itemHeight
}
const currentList = ref<any[]>()
onBeforeMount(() => {
  updateCurrentList(0)
})
</script>

<style lang="scss" scoped></style>
