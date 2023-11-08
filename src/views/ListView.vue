<template>
  <div>
    <!-- <ul class="list-wrapper">
      <li v-for="(data, index) in dataList" :key="index">
        -{{ data.address1 }} -{{ data.address2 }} -{{ data.address3 }} -{{ data.age }} -{{
          data.firstName
        }}
        -{{ data.id }} -{{ data.lastName }}
      </li>
    </ul> -->
    <!-- <FixedSizeList :source="dataList" :itemHeight="70" :containerHeight="600"> </FixedSizeList> -->
    <VariableSizeList
      :estimatedItemHeight="50"
      :containerHeight="500"
      :source="variableDataList"
    ></VariableSizeList>
  </div>
</template>

<script lang="ts" setup>
import FixedSizeList from '@/components/v-list/FixedSizeList.vue'
import VariableSizeList from '@/components/v-list/VariableSizeList.vue'
import { faker } from '@faker-js/faker'

interface RecordType {
  id: number
  firstName: string
  lastName: string
  age: number
  address1: string
  address2: string
  address3: string
}
const getData = (count: number) => {
  const data: RecordType[] = new Array(count).fill(null).map((_, index) => ({
    id: index,
    firstName: `First_${index.toString(16)}`,
    lastName: `Last_${index.toString(16)}`,
    age: 25 + (index % 10),
    address1: `New York No. ${index} Lake Park`,
    address2: `London No. ${index} Lake Park`,
    address3: `Sydney No. ${index} Lake Park`
  }))

  return data
}
const getData2 = (count: number) => {
  const data: any[] = new Array(count).fill(null).map((_, index) => ({
    id: index,
    value: faker.lorem.sentences() // 长文本
    // src: faker.image.url()
  }))
  return data
}
// 10w 条数据就开始明显感觉到渲染变慢，LCP 指标变大，能到 2s 附近，20w 就更为卡顿， 滚动时帧数维持在 35 附近，同时 LCP 到了10s

// const dataList = getData(200000)

let variableDataList: any[] = getData2(10000)
</script>

<style lang="scss" scoped>
// .list-wrapper {
//   height: 500px;
//   overflow: auto;
// }
</style>
