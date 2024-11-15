<template>
  <div class="flex justify-center px4 pb8 pt4 lg:px10">
    <div class="relative w-100 flex flex-col gap-4">
      <div class="relative z-100 flex-center py2">
        <div class="relative flex-center gap-1 text-xl color-primary font-600">
          <div class="i-ph:orange-duotone" />
          {{ config.public.title }}
        </div>
      </div>

      <Generator />

      <div class="my-4 mt-15 h-1px w-20 border-t border-base" />

      <div class="flex items-center gap-4 text-sm">
        <span class="op40">{{ new Date().getFullYear() }} &copy; Ju</span>
        <button class="ml-auto op30 hover:op80" @click="toggleDark()">
          <div class="i-carbon:sun dark:i-carbon:moon" />
        </button>
        <a class="op30 hover:op80" href="https://github.com/lianchi/light-gen" target="_blank" rel="noopener noreferrer">
          <div class="i-ph:github-logo" />
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { toggleDark } from '~/logic/state'

const config = useRuntimeConfig()
</script>
