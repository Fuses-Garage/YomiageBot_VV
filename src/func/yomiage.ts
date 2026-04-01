import { AudioPlayerStatus, VoiceConnectionStatus, createAudioPlayer, createAudioResource, entersState } from "@discordjs/voice";
import { makeWav } from "../func/makewav";
const { getVoiceConnection } = require('@discordjs/voice');
const fs = require("fs");

const players = new Map<string, ReturnType<typeof createAudioPlayer>>();

function getOrCreatePlayer(gid: string) {
    let player = players.get(gid);
    if (!player) {
        player = createAudioPlayer();
        players.set(gid, player);
    }
    return player;
}

export const yomiage=async (text:string,gid:string)=>{
    try{
        const connection = getVoiceConnection(gid);
        if(!connection){
            console.log("接続がないです")
            return
        }

        if(connection.state.status !== VoiceConnectionStatus.Ready){
            await entersState(connection, VoiceConnectionStatus.Ready, 10_000);
        }

        const wavPath=await makeWav(text,process.env.VOICEVOX_ENDPOINT??"",`${process.env.SOUND_DIR}${Math.random().toString(32).substring(2)}.wav`)
        const resource = createAudioResource(wavPath);
        const player = getOrCreatePlayer(gid);
        connection.subscribe(player);
        player.play(resource);

        await entersState(player, AudioPlayerStatus.Idle, 30_000);
        fs.unlink(wavPath,()=>{});
    }catch(e){
        console.error("読み上げエラー:",e);
    }
}