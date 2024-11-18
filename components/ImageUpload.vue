<template>
  <div
    :class="value ? 'hover:border-base' : 'border-dashed hover:border-primary'"
    class="relative aspect-ratio-1 w-full flex-center flex-col cursor-pointer of-hidden border rounded-md border-base bg-ink"
  >
    <img
      v-if="value"
      :src="value"
      class="absolute inset-0 aspect-ratio-1 w-full rounded object-contain op100"
    >
    <template v-else>
      <div class="text-lg op50 i-ph:plus" />
      <div class="mb-6 op50">
        选择图片
      </div>
      <div class="absolute bottom-4 px-4 text-center text-sm op40">
        注：图片仅在本地解析，不会上传到服务器
      </div>
    </template>
    <button v-if="value" class="absolute right-0 top-0 z-20 m1 rounded-full bg-hex-8884 p1 op50 hover:op75" title="清除">
      <div class="i-carbon:close" @click="clear" />
    </button>
    <input
      type="file" accept="image/*"
      class="absolute bottom-0 left-0 right-0 top-0 z-10 max-h-full max-w-full cursor-pointer opacity-0.1"
      @input="read"
    >
  </div>
</template>

<script setup lang="ts">
import { errorInfo } from '~/logic/state'

defineProps<{
  title?: string
}>()

const value = defineModel<string>('modelValue', {
  type: String,
})

async function read(e: Event) {
  value.value = ''
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file)
    return

  if (file.size > 20 * 1024 * 1024) {
    errorInfo.image = '文件大小不能超过20MB'
    return
  }

  if (!file.type.startsWith('image/')) {
    errorInfo.image = '只能上传图片文件'
    return
  }

  const reader = new FileReader()
  const promise = new Promise<string>((resolve, reject) => {
    reader.onload = () => {
      resolve(reader.result as any)
    }
    reader.onerror = reject
  })
  reader.readAsDataURL(file)
  value.value = await promise
}

function clear() {
  value.value = ''
}
</script>
