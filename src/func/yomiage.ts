import { AudioPlayerStatus, VoiceConnectionStatus, createAudioPlayer, createAudioResource, entersState } from "@discordjs/voice";
import { makeWav } from "../func/makewav";
const { getVoiceConnection } = require('@discordjs/voice');
const fs = require("fs");

const players = new Map<string, ReturnType<typeof createAudioPlayer>>();
const queues = new Map<string, Promise<void>>();

export function getOrCreatePlayer(gid: string) {
    let player = players.get(gid);
    if (!player) {
        player = createAudioPlayer();
        players.set(gid, player);
    }
    return player;
}

async function _yomiage(text: string, gid: string) {
    const connection = getVoiceConnection(gid);
    if (!connection) {
        console.log("接続がないです");
        return;
    }

    if (connection.state.status !== VoiceConnectionStatus.Ready) {
        await entersState(connection, VoiceConnectionStatus.Ready, 10_000);
    }

    const wavPath = await makeWav(text, process.env.VOICEVOX_ENDPOINT ?? "", `${process.env.SOUND_DIR}${Math.random().toString(32).substring(2)}.wav`);
    const resource = createAudioResource(wavPath);
    const player = getOrCreatePlayer(gid);
    connection.subscribe(player);
    player.play(resource);

    await entersState(player, AudioPlayerStatus.Idle, 30_000);
    fs.unlink(wavPath, () => {});
}

export const yomiage = (text: string, gid: string) => {
    const prev = queues.get(gid) ?? Promise.resolve();
    const next = prev.then(() => _yomiage(text, gid)).catch((e) => {
        console.error("読み上げエラー:", e);
    });
    queues.set(gid, next);
};
