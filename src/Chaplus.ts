import axios from 'axios'
import config from 'config'

interface ChaplusOptions {
  username: string
  content: string
  tone?: string
}

interface ChaplusResultResponse {
  utterance: string
  score: number
}

export interface ChaplusResponse {
  bestResponse: ChaplusResultResponse
  responses: ChaplusResultResponse[]
}

interface ChaplusError {
  status: string
  message: string
}

export async function chaplus(
  options: ChaplusOptions
): Promise<ChaplusResponse | ChaplusError> {
  const content = options.content
  const username = options.username
  const tone = options.tone ?? 'normal'

  const apiKey = config.get('chaplusApiKey')
  const url = `https://www.chaplus.jp/v1/chat?apikey=${apiKey}`
  const result = await axios.post(url, {
    utterance: content,
    username: username,
    agentState: {
      agentName: 'jaotan',
      tone,
    },
    addition: {
      unknownResponses: ['高スコアの回答がありませんでした。'],
    },
  })
  if (result.status !== 200) {
    return {
      status: result.data.status,
      message: result.data.message,
    }
  }
  return result.data as ChaplusResponse
}
