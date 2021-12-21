import axios from 'axios'
import config from 'config'

interface UserLocalOptions {
  username: string
  userId: string
  content: string
}

interface UserLocalResult {
  status: string
  result: string
}

export async function userlocal(
  options: UserLocalOptions
): Promise<UserLocalResult> {
  const result = await axios.get('https://chatbot-api.userlocal.jp/api/chat', {
    params: {
      key: config.get('userlocalApiKey'),
      bot_name: 'jaotan',
      user_id: options.userId,
      user_name: options.username,
      message: options.content,
    },
  })
  return result.data as UserLocalResult
}
