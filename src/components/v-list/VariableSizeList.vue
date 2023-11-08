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
    <!-- startOffset 是一个下移的属性，意思要保持当前视窗下的内容始终保存在视窗的顶部，也就是要从start -->
    <div
      :style="{
        transform: `translate3d(0,${startOffset}px,0)`
      }"
    >
      <VariableItem
        :measure="updatePositionList"
        v-for="(item, index) in currentList"
        :key="index"
        :data="item"
      >
      </VariableItem>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, type ComputedRef } from 'vue'
import VariableItem from './VariableItem.vue'

interface Props {
  source: any[]
  estimatedItemHeight: number
  containerHeight: number
}

const props = defineProps<Props>()

const currentListLength = Math.ceil(props.containerHeight / props.estimatedItemHeight)
const container = ref<HTMLDivElement | null>(null)
let startOffset = ref<number>(0)
let startIdx = 0

const positionList = ref(
  props.source.map((item, index) => ({
    index: index,
    top: index * props.estimatedItemHeight,
    height: props.estimatedItemHeight,
    bottom: (index + 1) * props.estimatedItemHeight
  }))
)
const phantomHeight: ComputedRef<number> = computed(() => {
  const lastPosition = positionList.value[positionList.value.length - 1]
  return lastPosition.bottom
})
const updatePositionList = (offsetHeight: number, positionIdx: number) => {
  const position = positionList.value[positionIdx]
  let oldHeight = position.height
  let dHeight = oldHeight - offsetHeight
  position.height = offsetHeight
  if (dHeight !== 0) {
    position.bottom = position.bottom - dHeight
    for (let k = positionIdx + 1; k < positionList.value.length; k++) {
      positionList.value[k].top = positionList.value[k - 1].bottom
      positionList.value[k].bottom = positionList.value[k].bottom - dHeight
    }
  }
}
let topOffset = 0
const handleScroll = () => {
  topOffset = container.value!.scrollTop
  startIdx = positionList.value.findIndex((i) => i && i.bottom > topOffset)
  updateCurrentList(startIdx)
}

function updateCurrentList(idx: number) {
  currentList.value = props.source.slice(idx, idx + currentListLength).map((item, curIdx) => ({
    ...item,
    positionIdx: idx + curIdx
  }))

  startOffset.value = positionList.value[idx].top
}
const currentList = ref<any[]>(
  props.source.slice(0, currentListLength).map((item, curIdx) => ({
    ...item,
    positionIdx: 0 + curIdx
  }))
)
</script>

<style lang="scss" scoped>
.list-phantom {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
}
</style>
