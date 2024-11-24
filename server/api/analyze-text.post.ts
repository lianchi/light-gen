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

async function fetchAiResponse(userText: string) {
  const completion = await openai.chat.completions.create({
    messages: [
      { role: 'system', content: PROMPT_TEXT_EN },
      { role: 'user', content: userText },
    ],
    model: config.AI.modelName,
    temperature: 1.5,
    response_format: { type: 'json_object' },
  })

  const content = JSON.parse(completion.choices[0].message.content || '{}')

  return content
}

// 验证请求来源
function validateOrigin(event: H3Event) {
  const origin = getHeader(event, 'origin')
  const referer = getHeader(event, 'referer')

  const allowedOrigin = config.public.allowedOrigin as string[]

  if (origin && allowedOrigin.some(url => origin.includes(url)))
    return

  if (referer && allowedOrigin.some(url => referer.includes(url)))
    return

  throw createError({
    statusCode: 403,
    message: '未授权的访问来源',
  })
}

export default defineEventHandler(async (event: H3Event) => {
  try {
    validateOrigin(event)

    // 获取请求体
    const body = await readBody<RequestBody>(event)
    const req = event.node.req

    if (!body.text) {
      throw createError({
        statusCode: 400,
        message: '文本不能为空',
      })
    }

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
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || '分析文本时发生错误',
    })
  }
})
