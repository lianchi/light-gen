import OpenAI from 'openai'
import type { H3Event } from 'h3'
import { createError } from 'h3'
import { PROMPT_TEXT_EN } from '@/constants/prompts'

interface RequestBody {
  text: string
}
interface ResponseBody {
  color?: string
  reason?: string
}

const config = useRuntimeConfig()

const openai = new OpenAI({
  baseURL: config.AI.baseURL,
  apiKey: config.AI.apiKey,
  maxRetries: 3,
  timeout: 20000,
})

const CLIENT_ERROR_FLAG = '__CLIENT_ERROR__'

const cache = new Map<string, { data: ResponseBody; timestamp: number }>()
const CACHE_TTL = 10 * 60 * 1000 // 10分钟缓存

async function fetchAiResponse(userText: string) {
  const cacheKey = userText.trim()
  const cachedData = cache.get(cacheKey)
  if (cachedData && Date.now() - cachedData.timestamp < CACHE_TTL)
    return cachedData.data

  const completion = await openai.chat.completions.create({
    messages: [
      { role: 'system', content: PROMPT_TEXT_EN },
      { role: 'user', content: userText },
    ],
    model: config.AI.modelName,
    response_format: { type: 'json_object' },
  })

  const content = JSON.parse(completion.choices[0].message.content || '{}')

  cache.set(cacheKey, {
    data: content,
    timestamp: Date.now(),
  })

  return content
}

export default defineEventHandler(async (event: H3Event) => {
  try {
    // 获取请求体
    const body = await readBody<RequestBody>(event)
    const req = event.node.req

    if (!body.text)
      throw createError({ statusMessage: CLIENT_ERROR_FLAG, message: '文本不能为空' })

    const res: ResponseBody = await fetchAiResponse(body.text)

    const log = {
      ip: getRequestIP(event, { xForwardedFor: true }) || 'unKnownIP',
      platform: req.headers['sec-ch-ua-platform'],
      ua: req.headers['sec-ch-ua'],
      text: body.text,
      color: res.color,
      reason: res.reason,
    }
    console.log('log', log)
    return res
  }
  catch (error: any) {
    if (error?.statusMessage === CLIENT_ERROR_FLAG)
      throw createError({ statusCode: 400, message: error.message })
    else
      throw createError({ statusCode: 500, message: `分析文本时发生错误-${error.message}` })
  }
})
