//必要なパッケージをインポートする
import { GatewayIntentBits, Client, Partials, Message, Interaction, VoiceState } from 'discord.js'
import dotenv from 'dotenv'
import { CallCommand, callFunc, CallFuncWithoutSlash } from './commands/call'
import { LeaveCommand, leaveFunc, leaveFuncWithoutSlash } from './commands/leave'
import { RingCommand, ringFunc } from './commands/ring'
import { yomiage } from './func/yomiage'
import { generateDependencyReport, getVoiceConnection } from '@discordjs/voice'
import { dictAddFuncWithoutSlash, dictDeleteFuncWithoutSlash, dictGetFuncWithoutSlash } from './commands/dict'

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
    const str=message.content.split(" ")
    if(str[0]=="!yomiage"){
        if(str.length>=2){
        switch(str[1]){
          case "call":
            CallFuncWithoutSlash(message).then(()=>{
              //@ts-ignore
              MAP.set(message.guildId??"",message.channelId)
            }).catch((e) => console.error("call error:", e))
            return
          case "leave":
            leaveFuncWithoutSlash(message).catch((e) => console.error("leave error:", e))
            return
          case "dict":
            if(str.length<3){
              message.reply("引数が足りません")
              return
            }
            switch(str[2]){
              case "add":
                if(str.length<5){
                  message.reply("引数が足りません")
                  return
                }
                console.log("array"+JSON.stringify(str))
                dictAddFuncWithoutSlash(message,str[3],str[4]).catch((e) => console.error("dict add error:", e))
                return
              case "get":
                dictGetFuncWithoutSlash(message).catch((e) => console.error("dict get error:", e))
                return
              case "delete":
                if(str.length<4){
                  message.reply("引数が足りません")
                  return
                }
                dictDeleteFuncWithoutSlash(message,str[3]).catch((e) => console.error("dict delete error:", e))
                return
            }
            return
        }
      }else{
        message.reply("引数が足りません")
        return
      }
    }
    if(!target)return
    if(message.channelId!=target)return
    yomiage(message.content.replace(/(https?|ftp)(:\/\/[-_\.!~*\'()a-zA-Z0-9;\/?:\@&=\+\$,%#]+)/,"").replace(/;.*\n/,"").replace(/;.*$/,""),message.guildId??"0")
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
client.on("interactionCreate", (i) => ComandCalled(i).catch((e) => console.error("interactionCreate error:", e)))

client.on("voiceStateUpdate", (oldState: VoiceState, _newState: VoiceState) => {
    if (!oldState.channel) return
    const me = oldState.guild.members.me
    if (!me?.voice.channel) return
    if (oldState.channel.id !== me.voice.channel.id) return
    const members = oldState.channel.members.filter(m => !m.user.bot)
    if (members.size === 0) {
        const connection = getVoiceConnection(oldState.guild.id)
        if (connection) {
            connection.destroy()
            MAP.delete(oldState.guild.id)
            console.log("全員退室したため切断しました")
        }
    }
})

//ボット作成時のトークンでDiscordと接続
client.login(process.env.TOKEN)