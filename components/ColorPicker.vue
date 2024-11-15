<template>
  <div class="relative h-10 flex items-center gap-2 px2 py1 border-box bg-secondary">
    <div v-if="!isFont" class="h-6 w-6 border rounded-full border-base" :style="{ background: value }" />
    <div v-else class="flex flex-col items-center justify-center">
      <span class="text-sm leading-none">A</span>
      <div :style="{ background: value }" class="h-4px w-16px" />
    </div>
    <div v-if="showValue" class="text-sm font-mono">
      {{ value }}
    </div>
    <input v-model="value" type="color" class="absolute inset-0 z-10 h-full w-full opacity-0.1">
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  showValue?: boolean
  isFont?: boolean
}>(), {
  showValue: true,
  isFont: false,
})
const value = defineModel<string>('modelValue', {
  type: String,
})
</script>
