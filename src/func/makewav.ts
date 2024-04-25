const fs = require("fs");
export async function makeWav(text:string, ep:string, path:string){
    const url_query = `${ep}/audio_query?text=${text}&speaker=8`
    const url_synth = `${ep}/synthesis?speaker=8&enable_interrogative_upspeak=true`
    return fetch(url_query, { method: 'post', headers: { 'accept': 'application/json' }, body: null })
    .then(res => res.text())
    .then(query => fetch(url_synth, { method: 'post', headers: { "accept": "audio/wav", 'Content-Type': 'application/json' }, body: query }))
    .then(res => res.arrayBuffer())
    .then(ab=>fs.writeFileSync(path, Buffer.from(ab), 'binary'))
    .then(_=>path)
  }