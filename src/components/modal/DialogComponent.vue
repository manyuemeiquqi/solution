<template>
  <ElDialog
    :show-close="false"
    v-model="visible"
    title="dialog"
    width="30%"
    align-center
    v-bind="$attrs"
  >
    <template #header>
      <slot name="header"> </slot>
    </template>

    <template #footer>
      <slot name="footer">
        <ElButton
          @click="onCancel"
          v-bind="$props.dialogConfig?.cancelProps"
          :loading="cancelLoading"
          >取消</ElButton
        >
        <ElButton
          v-bind="$props.dialogConfig?.confirmProps"
          @click="onConfirm"
          :loading="confirmLoading"
          >确认</ElButton
        >
      </slot>
    </template>
  </ElDialog>
</template>

<script lang="ts">
import { defineComponent, ref, type PropType, onMounted, onUnmounted } from 'vue'
import { removeDialog, registerDialog } from './dialogManager'
interface DialogConfig {
  handleCancel: () => Promise<any>
  handleConfirm: () => Promise<any>
  handleError?: (e: unknown) => unknown
  confirmProps?: any
  cancelProps?: any
}
export default defineComponent({
  props: {
    dialogConfig: {
      type: Object as PropType<DialogConfig>,
      default: () => ({
        handleCancel: () => Promise.resolve(),
        handleConfirm: () => Promise.resolve(),
        confirmProps: {},
        cancelProps: {}
      })
    }
  },
  setup(props, ctx) {
    const visible = ref<boolean>(false)
    const confirmLoading = ref<boolean>(false)
    const cancelLoading = ref<boolean>(false)
    const openDialog = () => (visible.value = true)
    const closeDialog = () => (visible.value = false)
    const onCancel = async () => {
      cancelLoading.value = true
      try {
        await props.dialogConfig.handleCancel()
        closeDialog()
      } catch (error) {
        console.log('error: ', error)
      } finally {
        cancelLoading.value = false
      }
    }
    const onConfirm = async () => {
      confirmLoading.value = true
      try {
        await props.dialogConfig.handleConfirm()
        closeDialog()
      } catch (error) {
        console.log('error: ', error)
      } finally {
        confirmLoading.value = false
      }
    }
    ctx.expose({
      openDialog,
      closeDialog
    })

    const dialogRef = ref()
    onMounted(() => {
      registerDialog(dialogRef)
    })
    onUnmounted(() => {
      console.log('销毁')

      removeDialog(dialogRef)
    })
    return { cancelLoading, confirmLoading, visible, onConfirm, onCancel }
  }
})
</script>

<style lang="scss" scoped></style>
