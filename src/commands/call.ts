import { joinVoiceChannel } from "@discordjs/voice";
import { ChannelType, CommandInteraction, Message, SlashCommandBuilder, SlashCommandChannelOption } from "discord.js";

export const CallCommand=new SlashCommandBuilder()
.addChannelOption((build:SlashCommandChannelOption)=>{
    build.setRequired(true)
    build.addChannelTypes(ChannelType.GuildVoice)
    build.setName("voicetarget")
    build.setDescription("音声を再生するボイスチャンネル")
    return build
})
.addChannelOption((build:SlashCommandChannelOption)=>{
    build.setRequired(true)
    build.addChannelTypes(ChannelType.GuildText)
    build.setName("readtarget")
    build.setDescription("読み上げる対象のテキストチャンネル")
    return build
})
.setName("call")
.setDescription("読み上げbotを呼び出します")
export const callFunc=async (interaction:CommandInteraction)=>{
    console.log("/call")
    try{
        //@ts-ignore
        const channel=interaction.options.getChannel("voicetarget")
        const c_id=channel?.id
        const g_id=interaction.guildId
        console.log(c_id,g_id)
        console.log(channel)
        const a_creator=interaction.guild?.voiceAdapterCreator
        console.log(a_creator)
        if (!channel) {
        interaction.reply({
            content: "接続先のVCが見つかりません。",
            ephemeral: true,
        });
        return
        }
        if (!channel.joinable) {
        interaction.reply({
            content: "VCに接続できません。",
            ephemeral: true,
        });
        return
        }
        if (!channel.speakable) {
        interaction.reply({
            content: "VCで音声を再生する権限がありません。",
            ephemeral: true,
        });
        return
        }
        if(a_creator&&c_id&&g_id){
            const connection = joinVoiceChannel({
                channelId: c_id,
                guildId: g_id,
                adapterCreator: a_creator,
                selfMute: false,
                selfDeaf: true,
            });
            console.log(connection.state)
            interaction.reply("接続に成功しました。").catch(() => { });
        }else{
            throw("")
        }
        return
    }catch(e){
        interaction.reply("エラーが発生しました。").catch(() => { });
    }
}
export const CallFuncWithoutSlash=async (message:Message)=>{
    console.log("/call")
    try{
        //@ts-ignore
        const channel=message.member?.voice.channel
        const c_id=channel?.id
        const g_id=message.guildId
        console.log(c_id,g_id)
        console.log(channel)
        const a_creator=message.guild?.voiceAdapterCreator
        console.log(a_creator)
        if (!channel) {
            message.reply({
            content: "接続先のVCが見つかりません。",
        });
        return
        }
        if (!channel.joinable) {
            message.reply({
            content: "VCに接続できません。",
        });

        return
        }
        if(a_creator&&c_id&&g_id){
            const connection = joinVoiceChannel({
                channelId: c_id,
                guildId: g_id,
                adapterCreator: a_creator,
                selfMute: false,
                selfDeaf: true,
            });
            console.log(connection.state)
            message.reply("接続に成功しました。").catch(() => { });
        }else{
            throw("")
        }
        return
    }catch(e){
        message.reply("エラーが発生しました。").catch(() => { });
    }
}