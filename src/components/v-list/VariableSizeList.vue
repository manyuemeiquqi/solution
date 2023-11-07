<template>
  <div
    ref="container"
    :style="{
      height: props.containerHeight + 'px',
      overflow: 'auto',
      position: 'relative'
    }"
    @scroll="handleScroll"
  >
    <div class="list-phantom" :style="{ height: `${phantomHeight}px` }"></div>
    <div
      :style="{
        transform: `translate3d(0,${listTopOffset}px,0)`
      }"
    >
      <div ref="currentListRef" v-for="(item, index) in currentList" :key="index">
        {{ item }}
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onBeforeMount, onMounted, ref, type ComputedRef } from 'vue'

interface Props {
  source: any[]
  estimatedItemHeight: number
  containerHeight: number
}

const props = defineProps<Props>()

const currentListLength = Math.ceil(props.containerHeight / props.estimatedItemHeight)
const container = ref<HTMLDivElement | null>(null)
let listTopOffset = ref<number>(0)

const positionList = ref(
  props.source.map((item, index) => ({
    index: index,
    top: index * props.estimatedItemHeight,
    bottom: (index + 1) * props.estimatedItemHeight,
    height: props.estimatedItemHeight
  }))
)
const phantomHeight: ComputedRef<number> = computed(() => {
  return positionList.value.reduce((prev, cur) => prev + cur.height, 0)
})
let startIdx = 0
const handleScroll = () => {
  const topOffset = container.value!.scrollTop

  startIdx = positionList.value.findIndex((i) => i && i.bottom > topOffset)

  updateCurrentList(startIdx)
}

function updateCurrentList(idx: number) {
  currentList.value = props.source.slice(idx, idx + currentListLength)
  currentListRef.value?.forEach((item) => {
    resizeObserver.observe(item)
  })
  listTopOffset.value = positionList.value[idx].top
}
const currentList = ref<any[]>(props.source.slice(0, currentListLength))
onMounted(() => {
  updateCurrentList(0)
})
const currentListRef = ref<HTMLDivElement[] | null>(null)
const resizeObserver = new ResizeObserver((entries) => {
  entries.forEach((entry, index) => {
    const positionIdx = startIdx + index
    const curPosition = positionList.value[positionIdx]
    curPosition.top = (entry.target as HTMLDivElement).offsetTop
    const domHeight = entry.target.clientHeight
    let oldHeight = curPosition.height
    curPosition.height = domHeight
    let dHeight = oldHeight - domHeight
    debugger
    // 向下更新
    if (dHeight) {
      curPosition.bottom = curPosition.bottom - dHeight
      for (let k = positionIdx + 1; k < positionList.value.length; k++) {
        positionList.value[k].top = positionList.value[k - 1].bottom
        positionList.value[k].bottom = positionList.value[k].bottom - dHeight
      }
    }
  })
})
</script>

<style lang="scss" scoped>
.list-phantom {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
}
</style>
