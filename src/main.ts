//必要なパッケージをインポートする
import { GatewayIntentBits, Client, Partials, Message, Interaction } from 'discord.js'
import dotenv from 'dotenv'
import { CallCommand, callFunc, CallFuncWithoutSlash } from './commands/call'
import { LeaveCommand, leaveFunc, leaveFuncWithoutSlash } from './commands/leave'
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

const MAP:Map<string,string>=new Map<string,string>()
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
    const target=MAP.get(message.guildId??"")
    console.log(MAP)
    console.log(target,message.channelId)
    switch(message.content){
      case "!yomiage call":
        CallFuncWithoutSlash(message).then(()=>{
          //@ts-ignore
          MAP.set(message.guildId??"",message.channelId)
          return
        })
        break
      case "!yomiage leave":
        leaveFuncWithoutSlash(message)
    }
    if(!target)return
    if(message.channelId!=target)return
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
        return await callFunc(interaction).then(()=>{
                  //@ts-ignore
          MAP.set(interaction.guildId??"",interaction.options.getChannel("readtarget").id)
          return
        })
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