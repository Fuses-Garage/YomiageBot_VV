import { createAudioPlayer, createAudioResource, StreamType } from "@discordjs/voice";
import { makeWav } from "../func/makewav";
const { getVoiceConnection } = require('@discordjs/voice');
const fs = require("fs");
export const yomiage=async (text:string,gid:string)=>{
    try{
        const connection = getVoiceConnection(gid);
        if(!connection){
            console.log("接続がないです")
            return
        }
        const path=await makeWav(text,process.env.VOICEVOX_ENDPOINT??"",`${Math.random().toString(32).substring(2)}.wav`)
        const resource = createAudioResource(path,
        {
        inputType: StreamType.Arbitrary,
        });
        const player = createAudioPlayer({});
        player.play(resource);
        connection.subscribe(player);
    }catch{
    return
    }
}