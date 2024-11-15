import legacy from '@vitejs/plugin-legacy'

export default defineNuxtConfig({
  modules: [
    '@vueuse/nuxt',
    '@unocss/nuxt',
    '@nuxtjs/color-mode',
  ],

  runtimeConfig: {
    public: {
      title: '橙子有光',
      rateLimit: {
        max: 10, // maximum requests per duration time
        duration: 60, // duration time in seconds, 1 minute
        ban: 60 * 1, // ban time in seconds, 1 minute
        retryAfterHeader: false, // when the user is banned, add the Retry-After header to the response
      },
    },
    AI: {
      baseURL: process.env.AI_BASE_URL,
      apiKey: process.env.AI_API_KEY,
      modelName: process.env.AI_MODEL_NAME,
    },
  },

  ssr: false,

  experimental: {
    payloadExtraction: false,
    renderJsonPayloads: true,
    typedPages: true,
  },

  nitro: {
    experimental: {
      tasks: true,
    },
    scheduledTasks: {
      '*/15 * * * *': ['cleanBans'], // clean the rate limit storage every 15 minutes
    },
    storage: {
      'rate-limit': {
        driver: 'memory',
      },
    },
    routeRules: {
      '/*': {
        cors: true,
      },
    },
  },

  spaLoadingTemplate: false,

  vite: {
    vue: {
      script: {
        defineModel: true,
      },
    },
    plugins: [
      legacy(),
    ],
    server: {
      cors: true,
    },
  },

  imports: {
    dirs: [],
  },

  compatibilityDate: '2024-11-15',
})
