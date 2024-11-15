<template>
  <div class="flex justify-center px4 pb8 pt4 lg:px10">
    <div class="relative w-100 flex flex-col gap-4">
      <div class="relative z-100 flex-center py2">
        <div class="relative flex-center gap-2 text-1.3rem color-primary font-600">
          <img class="h-8" src="/logo.svg">
        </div>
      </div>

      <Generator />

      <div class="my-4 mt-15 h-1px w-20 border-t border-base" />

      <footer>
        <div class="flex items-center gap-4 text-sm">
          <span class="op40">{{ new Date().getFullYear() }} &copy; Ju</span>
          <button class="ml-auto op40 hover:op80" @click="toggleDark()">
            <div class="i-carbon:sun dark:i-carbon:moon" />
          </button>
          <a class="op40 hover:op80" href="https://github.com/lianchi/light-gen" target="_blank" rel="noopener noreferrer">
            <div class="i-ph:github-logo" />
          </a>
        </div>
        <div class="flex items-center text-sm">
          <span class="op40">灵感来源：</span>
          <a
            class="cursor-pointer underline op40 hover:op80"
            href="https://apps.apple.com/us/app/%E5%B0%8F%E7%8C%AB%E8%A1%A5%E5%85%89%E7%81%AF/id6737742513"
            target="_blank"
            rel="noopener noreferrer"
          >
            小猫补光灯
          </a>
          <span class="ml-2 op40">by @chenyunfei</span>
        </div>
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
import { toggleDark } from '~/logic/state'
</script>
