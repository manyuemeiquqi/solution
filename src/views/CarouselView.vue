<template>
  <div>
    <Carousel :data-list="imgList" :cycle="3000" />
  </div>
</template>

<script lang="ts" setup>
import Carousel from '@/components/carousel/CarouselComponent.vue'
import { ref } from 'vue'
import type { ImgData } from '@/components/carousel/type'
const imgList = ref<ImgData[]>([
  {
    src: 'https://p5.ssl.qhimg.com/t0119c74624763dd070.png'
  },
  {
    src: 'https://p4.ssl.qhimg.com/t01adbe3351db853eb3.jpg'
  },
  {
    src: 'https://p2.ssl.qhimg.com/t01645cd5ba0c3b60cb.jpg'
  },
  {
    src: 'https://p2.ssl.qhimg.com/t01331ac159b58f5478.jpg'
  }
])
</script>

<style lang="scss" scoped></style>
