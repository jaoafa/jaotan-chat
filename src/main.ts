import config from 'config'
import { Client, Intents, Message } from 'discord.js'
import { chaplus, ChaplusResponse } from './Chaplus'
import { userlocal } from './UserLocal'

const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
})

export function getClient() {
  return client
}

client.on('ready', async () => {
  console.log(`ready: ${client.user?.tag}`)
})
function checkError(arg: any) {
  return (
    arg !== null && typeof arg === 'object' && typeof arg.status === 'string'
  )
}

async function userReply(message: Message) {
  const tone =
    message.cleanContent.match(/tone:\S+/)?.[0]?.split(':')[1] ?? undefined
  const content = message.cleanContent
    .replace(/@\S+/g, '')
    .replace(/tone:\S+/, '')
  const result = await chaplus({
    username: message.author.username,
    content: content,
    tone: tone,
  })
  if (checkError(result)) {
    return
  }
  const response = (result as ChaplusResponse).bestResponse.utterance
  console.log(JSON.stringify((result as ChaplusResponse).responses))
  if ((result as ChaplusResponse).bestResponse.score >= 0.5) {
    await message.reply(
        response.trim() +
        ' (score:' +
        Math.floor((result as ChaplusResponse).bestResponse.score * 100) +
        '%)'
    )
    return;
  }
  console.log("score: " + (result as ChaplusResponse).bestResponse.score + " retry...")
  const retryResult = await chaplus({
    username: message.author.username,
    content: content,
    tone: tone,
  })
  if (checkError(retryResult)) {
    return
  }
  const retryResponse = (retryResult as ChaplusResponse).bestResponse.utterance
  console.log(JSON.stringify((retryResult as ChaplusResponse).responses))
  await message.reply(
      response.trim() +
      ' (score:' +
      Math.floor((result as ChaplusResponse).bestResponse.score * 100) +
      '%)\n' +
      retryResponse.trim() +
      ' (score:' +
      Math.floor((retryResult as ChaplusResponse).bestResponse.score * 100) +
      '%)\n'
  )
}

async function roleReply(message: Message) {
  const content = message.cleanContent.replace(/@\S+/g, '')
  const result = await userlocal({
    username: message.author.username,
    userId: message.author.id,
    content: content,
  })
  const response = result.result
  console.log(JSON.stringify(result))
  await message.reply(response.trim())
}

client.on('messageCreate', async (message: Message) => {
  if (message.author.id === client.user?.id) return
  if (message.mentions.has(client.user!)) {
    userReply(message)
  }
  if (message.mentions.roles.has('597405190156714004')) {
    roleReply(message)
  }
})

client
  .login(config.get('discordToken'))
  .then(() => console.log('Login Successful.'))
