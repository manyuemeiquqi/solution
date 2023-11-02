<template>
  <div id="my-slider" class="slider-list">
    <ul>
      <li :class="itemClass(index)" v-for="(data, index) in props.dataList" :key="index">
        <img :src="data.src" />
      </li>
    </ul>

    <a @click="handlePrev" class="slide-list__previous"></a>
    <a class="slide-list__next" @click="handleNext"></a>
    <div class="slide-list__control">
      <span
        :class="buttonClass(index)"
        @mouseover="handleMouseover(index)"
        @mouseout="handleMouseout"
        v-for="(button, index) in props.dataList"
        :key="index"
      ></span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { ImgData } from './type'
import { onBeforeMount, onBeforeUnmount, ref } from 'vue'
import Slider from './control'

interface Props {
  dataList: ImgData[]
  cycle?: number
}
const props = withDefaults(defineProps<Props>(), {
  cycle: 3000
})
const handleMouseover = (idx: number) => {
  sliderInstance.slideTo(idx)
  sliderInstance.stop()
}
const handleMouseout = () => {
  sliderInstance.start()
}
const handleNext = () => {
  sliderInstance.slideNext()
}
const handlePrev = () => {
  sliderInstance.slidePrevious()
}
const itemClass = (index: number) => {
  return {
    'slider-list__item': cur.value !== index,
    'slider-list__item--selected': cur.value === index
  }
}
const buttonClass = (index: number) => {
  return {
    'slide-list__control-buttons': cur.value !== index,
    'slide-list__control-buttons--selected': cur.value === index
  }
}

const cur = ref<number>(0)
const sliderInstance = new Slider(cur, props.dataList, props.cycle)

onBeforeMount(() => {
  sliderInstance.start()
})
onBeforeUnmount(() => {
  sliderInstance.stop()
})
</script>

<style lang="scss" scoped>
#my-slider {
  position: relative;
  width: 790px;
  height: 340px;
}

.slider-list ul {
  list-style-type: none;
  position: relative;
  width: 100%;
  height: 100%;
  padding: 0;
  margin: 0;
}

.slider-list__item,
.slider-list__item--selected {
  position: absolute;
  transition: opacity 1s;
  opacity: 0;
  text-align: center;
}

.slider-list__item--selected {
  transition: opacity 1s;
  opacity: 1;
}

.slide-list__control {
  position: relative;
  display: table;
  background-color: rgba(255, 255, 255, 0.5);
  padding: 5px;
  border-radius: 12px;
  bottom: 30px;
  margin: auto;
}

.slide-list__next,
.slide-list__previous {
  display: inline-block;
  position: absolute;
  top: 50%;
  margin-top: -25px;
  width: 30px;
  height: 50px;
  text-align: center;
  font-size: 24px;
  line-height: 50px;
  overflow: hidden;
  border: none;
  background: transparent;
  color: white;
  background: rgba(0, 0, 0, 0.2);
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.5s;
}

.slide-list__previous {
  left: 0;
}

.slide-list__next {
  right: 0;
}

#my-slider:hover .slide-list__previous {
  opacity: 1;
}

#my-slider:hover .slide-list__next {
  opacity: 1;
}

.slide-list__previous:after {
  content: '<';
}

.slide-list__next:after {
  content: '>';
}

.slide-list__control-buttons,
.slide-list__control-buttons--selected {
  display: inline-block;
  width: 15px;
  height: 15px;
  border-radius: 50%;
  margin: 0 5px;
  background-color: white;
  cursor: pointer;
}

.slide-list__control-buttons--selected {
  background-color: red;
}
</style>
