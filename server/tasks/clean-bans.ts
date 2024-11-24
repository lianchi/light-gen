import { isBanExpired } from '../middleware/rate-limit'

export default defineTask({
  meta: {
    name: 'cleanBans',
    description: 'Clean expired bans',
  },
  async run() {
    const rateLimitStorage = useStorage('rate-limit')

    const keys = await rateLimitStorage.getKeys()
    keys.forEach(async (key) => {
      const rateLimit = (await rateLimitStorage.getItem(key)) as any
      if (isBanExpired(rateLimit))
        await rateLimitStorage.removeItem(key)
    })
    return { result: keys }
  },
})
