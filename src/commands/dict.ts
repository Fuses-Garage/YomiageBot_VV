import { Message } from "discord.js";
import { addDict, deleteDict, getDict } from "../func/dict";

export const dictAddFuncWithoutSlash=async (message:Message,t:string,y:string)=>{
    try{
        const res=await addDict(t,y,process.env.VOICEVOX_ENDPOINT??"")
        message.reply(res).catch(() => { });
    }catch(e){
        message.reply("エラーが発生しました。").catch(() => { });
    }
    return
}
export const dictGetFuncWithoutSlash=async (message:Message)=>{
    try{
        const res=await getDict(process.env.VOICEVOX_ENDPOINT??"")
        message.reply(res).catch(() => { });
    }catch(e){
        message.reply("エラーが発生しました。").catch(() => { });
    }
    return
}
export const dictDeleteFuncWithoutSlash=async (message:Message,id:string)=>{
    try{
        const res=await deleteDict(id,process.env.VOICEVOX_ENDPOINT??"")
        message.reply(res).catch(() => { });
    }catch(e){
        message.reply("エラーが発生しました。").catch(() => { });
    }
    return
}