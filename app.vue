<template>
  <NuxtPage />
</template>

<script setup lang="ts">
import './assets/styles.css'
import '@unocss/reset/tailwind.css'

const config = useRuntimeConfig()
const isDev = process.env.NODE_ENV === 'development'
useHead({
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover' },
    { name: 'format-detection', content: 'telephone=no' },
    { name: 'apple-mobile-web-app-capable', content: 'yes' },
    { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
  ],
  link: [
    { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
    { rel: 'apple-touch-icon', href: '/favicon.svg' },
  ],
  script: !isDev
    ? [
        {
          src: 'https://www.googletagmanager.com/gtag/js?id=G-W98LL03BZC',
          async: true,
        },
        {
          children: `window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-W98LL03BZC');`,
        },
      ]
    : [],
})

useSeoMeta({
  title: config.public.title,
})
</script>

