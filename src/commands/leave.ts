import { CommandInteraction, SlashCommandBuilder } from "discord.js";
const { getVoiceConnection } = require('@discordjs/voice');

export const LeaveCommand=new SlashCommandBuilder()
.setName("leave")
.setDescription("読み上げbotを帰らせます")
export const leaveFunc=async (interaction:CommandInteraction)=>{
    const connection = getVoiceConnection(interaction.guildId);
    try{
        if(connection){
            connection.destroy()
            interaction.reply("正常に切断しました。").catch(() => { });
        }else{
            interaction.reply("まだ接続してません。").catch(() => { });
        }
    }catch(e){
        interaction.reply("エラーが発生しました。").catch(() => { });
    }
    return
}