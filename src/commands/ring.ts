import { createAudioPlayer, createAudioResource, NoSubscriberBehavior, StreamType, VoiceConnection } from "@discordjs/voice";
import {CommandInteraction, SlashCommandBuilder} from "discord.js";
import { makeWav } from "../func/makewav";
const player = createAudioPlayer();
const { getVoiceConnection } = require('@discordjs/voice');
const fs = require("fs");
export const RingCommand=new SlashCommandBuilder()
.setName("ring")
.setDescription("テスト用音声を再生します")
export const ringFunc=async (interaction:CommandInteraction)=>{
    try{
        const connection = getVoiceConnection(interaction.guildId) as VoiceConnection;
        if(!connection){
            interaction.reply("未接続エラー").catch(() => { });
            return
        }
        const path=await makeWav("これはテスト音声です",process.env.VOICEVOX_ENDPOINT??"",`${process.env.SOUND_DIR}${Math.random().toString(32).substring(2)}.wav`)
        const resource = createAudioResource(path, { inputType: StreamType.Arbitrary });
        console.log(path)
        console.log(resource)
        player.play(resource);
        connection.setSpeaking(true)
        connection.subscribe(player);
        interaction.reply("テスト用音声を再生します。").catch(() => { });
        }catch(e){
        console.log(e)
    return
    }
}