import { useUrlSearchParams } from '@vueuse/core'
import type { Category } from './state'

export interface Tab {
  value: Category
  label: string
  [key: string]: any
}

export function useUrlQuery(tabs: Ref<Tab[]> | Tab[]) {
  const urlParams: any = useUrlSearchParams('history')
  const tabsRef = ref(tabs)

  function defaultTab() {
    const c = urlParams.tab
    if (c && tabsRef.value.find(u => u.value === c))
      return c

    urlParams.tab = tabsRef.value[0].value
    return tabsRef.value[0].value
  }

  const activeTab: Ref<Category> = ref(defaultTab())

  watch(activeTab, (v) => {
    urlParams.tab = v
  })

  return {
    activeTab,
  }
}
