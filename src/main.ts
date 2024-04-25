//必要なパッケージをインポートする
import { GatewayIntentBits, Client, Partials, Message, Interaction } from 'discord.js'
import dotenv from 'dotenv'
import { CallCommand, callFunc } from './commands/call'
import { LeaveCommand, leaveFunc } from './commands/leave'
import { RingCommand, ringFunc } from './commands/ring'
import { yomiage } from './func/yomiage'
import { generateDependencyReport } from '@discordjs/voice'

console.log(generateDependencyReport());
//.envファイルを読み込む
dotenv.config()

//Botで使うGatewayIntents、partials
const client = new Client({
  intents: [
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates
  ],
  partials: [Partials.Message, Partials.Channel],
})

//Botがきちんと起動したか確認
client.once('ready', async() => {
    const data = [CallCommand,LeaveCommand,RingCommand];
    await client.application?.commands.set(data, process.env.GUILD_ID??"");
    console.log('Ready!')
    if(client.user){
        console.log(client.user.tag)
    }
})

//!timeと入力すると現在時刻を返信するように
client.on('messageCreate', async (message: Message) => {
    if (message.author.bot) return
    yomiage(message.content,message.guildId??"0")
})

async function ComandCalled(interaction: Interaction){
  console.log("command call")
  if(interaction.isCommand()){
    console.log(interaction.commandName)
    switch(interaction.commandName){
      case "leave":
        return await leaveFunc(interaction)
      case "call":
        return await callFunc(interaction)
      case "ring":
        return await ringFunc(interaction)
      default:
        interaction.reply("そんなコマンドないです。").catch(() => { });
    }
  }
}
client.on("interactionCreate", (i)=>ComandCalled(i).catch())

//ボット作成時のトークンでDiscordと接続
client.login(process.env.TOKEN)