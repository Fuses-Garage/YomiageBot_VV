# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Run Commands

- **`npm run test`** — Run bot directly with ts-node (`ts-node src/main.ts`)
- **`npm run compile`** — Compile TypeScript to `build/` (`tsc -p .`)
- **`npm run start`** — Run compiled bot (`node build/main.js`)

No test framework is configured. No linter script is defined; ESLint config exists at `eslint.config.mjs`.

## Architecture

Discord TTS (読み上げ) bot that reads text channel messages aloud in a voice channel using VOICEVOX as the speech synthesis engine.

### Flow

1. **Entry** (`src/main.ts`): Initializes Discord client, registers slash commands, maintains a `MAP<guildId, channelId>` tracking which text channels to read per guild.
2. **Joining VC** (`src/commands/call.ts`): `/call` slash command or `!yomiage call` prefix command joins the bot to a voice channel and maps the target text channel.
3. **Message → Speech** (`src/main.ts` → `src/func/yomiage.ts` → `src/func/makewav.ts`):
   - Incoming messages in monitored channels are sanitized (URLs stripped, `;`-prefixed lines skipped).
   - `makeWav()` calls VOICEVOX HTTP API (`/audio_query` → `/synthesis`) and writes a temporary WAV file.
   - `yomiage()` creates an audio resource, plays it through a per-guild `AudioPlayer`, waits for completion, then deletes the WAV.
4. **Dictionary** (`src/commands/dict.ts`, `src/func/dict.ts`): Custom pronunciation entries managed via VOICEVOX's `/user_dict_word` API. Only katakana readings accepted.

### Key Design Decisions

- Dual command interface: slash commands (`/call`, `/leave`, `/ring`) and prefix commands (`!yomiage call|leave|dict`).
- One `AudioPlayer` per guild, cached in a `Map` in `yomiage.ts`.
- Voice connections are retrieved via `getVoiceConnection(guildId)` — not stored locally.
- `adapterCreator` from discord.js requires `as any` cast due to type mismatch with `@discordjs/voice`.

## Environment Variables (`.env`)

- `TOKEN` — Discord bot token
- `VOICEVOX_ENDPOINT` — VOICEVOX API URL (default: `http://localhost:50021`)
- `SOUND_DIR` — Temporary WAV directory (e.g., `tmp/wav/`)
- `GUILD_ID` — Target guild for slash command registration

## Dependencies of Note

- **@discordjs/voice** — Voice connection and audio playback
- **opusscript** + **ffmpeg-static** — Required audio encoding/decoding runtime dependencies
- **VOICEVOX** — External TTS engine; must be running locally for the bot to function
