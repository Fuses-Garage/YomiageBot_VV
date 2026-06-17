import { AudioPlayerStatus, VoiceConnectionStatus, createAudioResource, entersState } from "@discordjs/voice";
import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { makeWav } from "../func/makewav";
import { getOrCreatePlayer } from "../func/yomiage";
import { getVoiceConnection } from "@discordjs/voice";
import fs from "fs";

export const RingCommand = new SlashCommandBuilder()
    .setName("ring")
    .setDescription("テスト用音声を再生します")

export const ringFunc = async (interaction: CommandInteraction) => {
    await interaction.deferReply();
    try {
        const connection = getVoiceConnection(interaction.guildId!);
        if (!connection) {
            await interaction.editReply("未接続エラー");
            return;
        }

        console.log("[ring] connection status:", connection.state.status);

        if (connection.state.status !== VoiceConnectionStatus.Ready) {
            await entersState(connection, VoiceConnectionStatus.Ready, 10_000);
        }

        const wavPath = await makeWav(
            "これはテスト音声です",
            process.env.VOICEVOX_ENDPOINT ?? "",
            `${process.env.SOUND_DIR}${Math.random().toString(32).substring(2)}.wav`
        );

        const stat = fs.statSync(wavPath);
        console.log("[ring] wav size:", stat.size, "path:", wavPath);

        const resource = createAudioResource(wavPath);
        const player = getOrCreatePlayer(interaction.guildId!);

        console.log("[ring] player status before play:", player.state.status);

        player.once("error", (e: Error) => console.error("[ring] player error:", e));

        const sub = connection.subscribe(player);
        console.log("[ring] subscription:", sub ? "ok" : "null");

        player.play(resource);
        console.log("[ring] player status after play:", player.state.status);

        await interaction.editReply("テスト用音声を再生します。");

        await entersState(player, AudioPlayerStatus.Playing, 5_000)
            .then(() => console.log("[ring] playing started"))
            .catch((e: Error) => console.error("[ring] never reached Playing:", e.message));

    } catch (e) {
        console.error("[ring] error:", e);
        await interaction.editReply("エラーが発生しました。").catch(() => { });
    }
}
