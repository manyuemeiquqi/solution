<template>
  <div ref="itemRef">{{ props.data }}</div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
const props = defineProps<{
  data: any
  measure: (offsetHeight: number, positionIdx: number) => void
}>()
const itemRef = ref<HTMLDivElement | null>(null)

const resizeObserver = new ResizeObserver(() => {
  if (itemRef.value?.offsetHeight) {
    console.log('props.data.positionIdx: ', props.data.positionIdx)
    // 这里原本的思路是通过事件绑定，然后emit事件，但是这种方式会导致十分卡顿，绑定事件会比较丝滑，也就是传入属性，属性为函数去修改外部变量
    props.measure(itemRef.value.offsetHeight, props.data.positionIdx)
  }
})
onMounted(() => {
  props.measure(itemRef.value?.offsetHeight as number, props.data.positionIdx)
  if (itemRef.value?.offsetHeight) {
    resizeObserver.observe(itemRef.value)
  }
})
onBeforeUnmount(() => {
  resizeObserver.unobserve(itemRef.value as Element)
})
</script>

<style lang="scss" scoped></style>
