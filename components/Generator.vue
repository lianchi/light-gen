<template>
  <div class="flex flex-col gap-4">
    <div class="flex flex-col gap-2">
      <SimpleTabs v-model="activeTab" :options="tabs" blocked />
      <template v-if="activeTab === 'text'">
        <textarea
          v-model="state.text"
          rows="3"
          maxlength="100"
          placeholder="你身处的场景，或者是你的心情 😄"
          outline="focus:none"
          class="border rounded-md px4 py2 border-base focus-within:border-primary bg-ink"
        />
        <button
          class="bg-primary text-button-bg"
          :class="{ '!cursor-not-allowed op50': loading }"
          :disabled="loading"
          @click="generateByText"
        >
          <div :class="!loading ? 'i-ph:magic-wand-duotone' : 'i-ph:spinner-gap-bold animate-spin'" />
          生成补光色
        </button>
      </template>

      <template v-if="activeTab === 'image'">
        <div class="mx-auto w-50 flex-center">
          <ImageUpload v-model="state.image" />
        </div>
        <button
          class="bg-primary text-button-bg"
          :class="{ '!cursor-not-allowed op50': loading }"
          :disabled="loading"
          @click="generateByImage"
        >
          <div :class="!loading ? 'i-ph:image-duotone' : 'i-ph:spinner-gap-bold animate-spin'" />
          从图片中提取补光色
        </button>
        <div v-if="state.image && imageColorList.length" class="my-2 flex-center flex-wrap gap-4">
          <button
            v-for="color of imageColorList"
            :key="color"
            class="relative h-8 w-8 rounded-md"
            :style="{ backgroundColor: color }"
            @click="state.color = color"
          >
            <div v-if="result.color === color" class="absolute bottom--2.5 w-full flex-center">
              <div class="h-1.5 w-1.5 rounded-full bg-primary" />
            </div>
          </button>
        </div>
      </template>

      <div v-if="activeTab === 'color'" class="flex items-center justify-between border rounded-md p4 border-base bg-ink">
        <ColorPicker v-model="state.color" />
        <button class="text-sm op40 hover:op80" @click="state.color = '#000000'">
          重置
        </button>
      </div>
    </div>

    <div v-if="errorInfo[activeTab]" class="border yellow-tip rounded px3 py2 text-sm">
      {{ errorInfo[activeTab] }}
    </div>

    <template v-if="result.color">
      <div class="mx-auto h-1px w-20 border-t border-base" />
      <div class="flex flex-col gap-2 rounded-md p3 bg-ink">
        <span class="op50">生成结果：</span>
        <div ref="imgRef" class="relative h-30 w-full rounded-md" :style="{ backgroundColor: result.color }">
          <button
            :title="isFullscreen ? '退出全屏' : '进入全屏'"
            :class="isFullscreen ? 'i-ph:corners-in-bold' : 'i-ph:corners-out-bold'"
            class="absolute right-3 top-3 icon-button"
            @click="toggle"
          />
          <div class="absolute bottom-3 right-3 flex items-center gap-2" :class="{ '!hidden': isFullscreen }">
            <span class="text-sm font-mono">
              {{ result.color }}
            </span>
            <button class="icon-button-sm" @click="copy(result.color)">
              <div :class="copied ? 'i-carbon:checkmark color-green-600' : 'i-carbon:copy'" title="复制" />
            </button>
          </div>
        </div>

        <div v-if="result.reason && activeTab === 'text'" class="rounded px3 py2 text-sm" :style="resultStyle">
          {{ result.reason }}
        </div>

        <button
          class="text-button-bg"
          :style="{ backgroundColor: resultStyle.buttonColor || 'violet' }"
          @click="downloadImage"
        >
          <div i-ph:download-simple />
          保存为纯色壁纸
        </button>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
// @ts-expect-error no types
import ColorThief from 'colorthief'
import {
  errorInfo,
  getResultFromCache,
  imageColorList,
  isDark,
  isMobile,
  loading,
  resetResult,
  result,
  setResultToCache,
  state,
} from '~/logic/state'
import { colorRgbToHex, generateColorShades } from '~/logic/utils'
import type { Tab } from '~/logic/urlQuery'
import { useUrlQuery } from '~/logic/urlQuery'

const tabs: Tab[] = [
  { value: 'text', label: '写句话' },
  { value: 'image', label: '传个图' },
  { value: 'color', label: '选个色' },
]
const { activeTab } = useUrlQuery(tabs)

const imgRef = ref<HTMLDivElement>()
const { isFullscreen, toggle } = useFullscreen(imgRef)
const { copy, copied } = useClipboard({
  legacy: true,
})

// 基于文字生成颜色值
async function generateByText() {
  const text = state.value.text?.trim()
  if (!text) {
    errorInfo.text = '请输入文字'
    return
  }

  loading.value = true

  const cachedResult = getResultFromCache(text)
  if (cachedResult) {
    await new Promise(resolve => setTimeout(resolve, 500))
    loading.value = false
    result.value = Object.assign({}, cachedResult)
    return
  }

  try {
    const res = await $fetch('/api/analyze-text', {
      method: 'POST',
      body: {
        text,
      },
    })
    result.value = {
      color: res.color || '',
      reason: res.reason || '',
    }
    setResultToCache(text, result.value)
    errorInfo.text = ''
  }
  catch (error: any) {
    console.log('error', error.data)
    resetResult()
    errorInfo.text = error.data.message
  }
  finally {
    loading.value = false
  }
}

// 基于图片生成颜色值
async function generateByImage() {
  if (!state.value.image) {
    errorInfo.image = '请上传图片'
    return
  }

  const colorThief = new ColorThief()
  const img = new Image()
  img.src = state.value.image
  img.crossOrigin = 'Anonymous'

  loading.value = true
  try {
    imageColorList.value = await new Promise<string[]>((resolve) => {
      img.onload = () => {
        const rgbList = colorThief.getPalette(img, 7)
        resolve(rgbList.map(colorRgbToHex))
      }
    })
    state.value.color = imageColorList.value[0]
    result.value = {
      color: imageColorList.value[0],
      reason: '',
    }
  }
  catch (error: any) {
    errorInfo.image = '无法从图片中提取颜色'
    resetResult()
  }
  finally {
    loading.value = false
  }
}

const resultStyle = computed(() => {
  const resultShades = generateColorShades(result.value.color!)
  if (!resultShades.length)
    return {}

  if (isDark.value) {
    return {
      backgroundColor: `${resultShades[4]}66`,
      color: resultShades[0],
      buttonColor: resultShades[3],
    }
  }
  return {
    backgroundColor: `${resultShades[0]}33`,
    color: resultShades[4],
    buttonColor: resultShades[2],
  }
})

// 将颜色作为图片下载，并遵照当前屏幕的分辨率，包括PC、手机
function downloadImage() {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  if (isMobile.value) {
    canvas.width = window.screen.width * window.devicePixelRatio
    canvas.height = window.screen.height * window.devicePixelRatio
  }
  else {
    canvas.width = window.screen.width
    canvas.height = window.screen.height
  }
  ctx!.fillStyle = result.value.color
  ctx!.fillRect(0, 0, canvas.width, canvas.height)

  const a = document.createElement('a')
  a.href = canvas.toDataURL('image/png')
  a.download = `${useRuntimeConfig().public.title}-${result.value.color}.png`
  a.click()
}
</script>

