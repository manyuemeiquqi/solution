<template>
  <div>
    <ElButton @click="handleClick1"> 点击触发 </ElButton>
    <DialogComponent :dialog-config="dialogConfig1" ref="dialogRef1"> </DialogComponent>

    <!-- <ElRow>
      <ElCol>
        <ElText class="mx-1" size="large"> 嵌套对话框 </ElText>

        <DialogComponent :dialog-config="dialogConfig2" ref="dialogRef2">
          <template #default>
            <ElButton @click="outerVisible = false">Cancel</ElButton>
            <DialogComponent :dialog-config="dialogConfig3" ref="dialogRef3" />
          </template>
        </DialogComponent>
      </ElCol>
    </ElRow> -->
  </div>
</template>

<script setup lang="ts">
import DialogComponent from '@/components/modal/DialogComponent.vue'
import { ref } from 'vue'
import { destroyAll } from '@/components/modal/dialogManager'
const dialogRef1 = ref()
const dialogConfig1 = {
  handleConfirm: () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        reject(5)
      }, 5000)
    })
      .then((res) => {
        console.log('res11111: ', res)
      })
      .catch((error) => {
        throw error
      })
      .finally(() => {
        console.log('fina')
      })
  },
  handleCancel: () => Promise.resolve(),
  confirmProps: {
    type: 'primary'
  }
}
const handleClick1 = () => {
  if (dialogRef1.value) {
    dialogRef1.value.openDialog()

    setTimeout(() => {
      destroyAll()
    }, 5000)
  }
}
</script>

<style scoped></style>
