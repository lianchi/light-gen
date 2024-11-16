export type Category = 'text' | 'image' | 'color'
interface Result {
  color: string
  reason: string
}

export const isSafari = computed(() => /^((?!chrome|android).)*safari/i.test(navigator.userAgent))
export const isIOS = computed(() => /iPad|iPhone|iPod/.test(navigator.userAgent))
export const isMobile = computed(() => /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))

export const isDark = useDark()
export const toggleDark = useToggle(isDark)

export const state = ref<Record<Category, string>>({
  text: '',
  image: '',
  color: '#000000',
})
// export const resultColor = useLocalStorage('light-gen:resultColor', '')

export const result = ref<Result>({
  color: '',
  reason: '',
})

// cache for text generator - Start
const cache = new Map<string, { data: Result; timestamp: number }>()
const CACHE_TTL = 10 * 60 * 1000 // 10 分钟缓存
export function getResultFromCache(text: string) {
  if (!text)
    return null

  const cachedData = cache.get(text)
  if (cachedData && Date.now() - cachedData.timestamp < CACHE_TTL)
    return cachedData.data

  return null
}
export function setResultToCache(text: string, result: Result) {
  if (!text)
    return
  cache.set(text, {
    data: result,
    timestamp: Date.now(),
  })
}
// cache for text generator - End

export function resetResult() {
  result.value = {
    color: '',
    reason: '',
  }
}

export const errorInfo = reactive<Record<Category, string>>({
  text: '',
  image: '',
  color: '',
})

export const loading = ref(false)

watch(() => state.value.text, (newVal, oldVal) => {
  if (newVal?.trim() && !oldVal?.trim())
    errorInfo.text = ''
})

export const imageColorList = ref<string[]>([])
watch(() => state.value.image, (newVal, oldVal) => {
  if (newVal && !oldVal)
    errorInfo.image = ''
  if (!newVal && oldVal)
    imageColorList.value = []
})

watch(() => state.value.color, (val) => {
  result.value = {
    color: val || '',
    reason: '',
  }
})
