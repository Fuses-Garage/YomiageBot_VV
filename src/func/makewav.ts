const fs = require("fs");
export async function makeWav(text: string, ep: string, path: string) {
    const speaker = process.env.VOICEVOX_SPEAKER ?? "8";
    const url_query = `${ep}/audio_query?text=${encodeURIComponent(text)}&speaker=${speaker}`;
    const url_synth = `${ep}/synthesis?speaker=${speaker}&enable_interrogative_upspeak=true`;

    const queryRes = await fetch(url_query, { method: 'post', headers: { 'accept': 'application/json' }, body: null });
    if (!queryRes.ok) throw new Error(`audio_query failed: ${queryRes.status} ${await queryRes.text()}`);
    const queryJson = await queryRes.json();
    if (!queryJson.speedScale || queryJson.speedScale === 0) queryJson.speedScale = 1.0;
    const query = JSON.stringify(queryJson);

    const synthRes = await fetch(url_synth, { method: 'post', headers: { "accept": "audio/wav", 'Content-Type': 'application/json' }, body: query });
    if (!synthRes.ok) throw new Error(`synthesis failed: ${synthRes.status} ${await synthRes.text()}`);

    const ab = await synthRes.arrayBuffer();
    fs.writeFileSync(path, Buffer.from(ab), 'binary');
    return path;
}
