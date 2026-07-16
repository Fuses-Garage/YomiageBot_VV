export async function addDict(text:string,yomi:string, ep:string){
    console.log(text,yomi)
    const url = `${ep}/user_dict_word?surface=${text}&pronunciation=${yomi}&accent_type=1`
    console.log(url)
    if(!/^[゠-ヿ]+$/.test(yomi)){
      return "読みはカタカナだけで構成される必要があります。"
    }
    return fetch(url, { method: 'post', headers: { 'accept': 'application/json' }})
    .then(()=>"辞書追加に成功しました")
    .catch((e)=>{ console.error("addDict error:", e); return "辞書追加に失敗しました" })
}
export async function getDict(ep:string){
  const url = `${ep}/user_dict`
  return fetch(url, { method: 'get', headers: { 'accept': 'application/json' }})
  .then((res)=>res.json())
  .then((json)=>{
      console.log(json)
      return Object.keys(json).reduce((p,e)=>{
      return `${p}\n${e} ${json[e].surface} ${json[e].yomi}`
    },"辞書取得に成功しました")
  })
  .catch((e)=>{ console.error("getDict error:", e); return "辞書取得に失敗しました" })
}
export async function deleteDict(id:string, ep:string){
  const url = `${ep}/user_dict_word/${id}`
  return fetch(url, { method: 'delete', headers: { 'accept': 'application/json' }})
  .then(()=>"辞書削除に成功しました")
  .catch((e)=>{ console.error("deleteDict error:", e); return "辞書削除に失敗しました" })
}
