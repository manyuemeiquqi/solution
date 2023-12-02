import type { ComponentPublicInstance, Ref } from 'vue'
interface DialogComponentExpose {
  openDialog: () => void
  closeDialog: () => void
}
type DialogComponentInstance = Ref<ComponentPublicInstance<DialogComponentExpose>>
const dialogSet = new Set<DialogComponentInstance>()

export const registerDialog = (dialog: DialogComponentInstance) => {
  dialogSet.add(dialog)
  console.log('dialogSet: ', dialogSet)
}
export const destroyAll = () => {
  dialogSet.forEach((item) => {
    if (item.value) {
      item.value.closeDialog()
    }
  })
  dialogSet.clear()
}
export const removeDialog = (dialog: DialogComponentInstance) => {
  dialogSet.delete(dialog)
}
