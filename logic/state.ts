export type Category = 'text' | 'image' | 'color'

export const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent)
export const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
export const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)

export const isDark = useDark()
export const toggleDark = useToggle(isDark)

export const state = ref<Record<Category, string>>({
  text: '',
  image: '',
  color: '#000000',
})
// export const resultColor = useLocalStorage('light-gen:resultColor', '')
export const resultColor = ref('')
export const resultReason = ref('')
export const errorInfo = reactive<Record<Category, string>>({
  text: '',
  image: '',
  color: '',
})
export const loading = ref(false)

watch(() => state.value.color, (val) => {
  resultColor.value = val || ''
  resultReason.value = ''
})

watch(() => state.value.text, (newVal, oldVal) => {
  if (newVal?.trim() && !oldVal?.trim())
    errorInfo.text = ''
})

watch(() => state.value.image, (newVal, oldVal) => {
  if (newVal?.trim() && !oldVal?.trim())
    errorInfo.image = ''
})

