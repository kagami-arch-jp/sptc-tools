const speaking={
  speaker: null,
}

export function support() {
  try{
    return window.speechSynthesis && true
  }catch(e) {}
  return false
}

function fix(txt) {
  return txt
    .replace(/AI/gi, 'A I')
    .replace(/UI/gi, 'U I')
    .replace(/[←→]/g, ' ')
    .replace(/\*\*/g, ' ')
    .replace(/\n\s*\[-*]\s/g, '\n ')
    .replace(/[〇△]/g, 'まる')
}

function loadVoice(lang, kw) {
  return window.speechSynthesis.getVoices().filter(x=>{
    return x.lang==lang && x.name.toLowerCase().indexOf(kw.toLowerCase())>-1
  })[0]
}

try{
  // preload voices on brower
  loadVoice('', '')
}catch(e) {}

export function getSpeaker() {
  if(!support()) return;
  speaking.speaker?.cancel()
  const synth = window.speechSynthesis
  speaking.speaker=synth
  const speak=async (sentence, lang='ja-JP')=>{
    const utter = new SpeechSynthesisUtterance(fix(sentence))
    utter.lang = lang
    utter.voice = loadVoice(lang, 'o-ren') || loadVoice(lang, 'google') || loadVoice(lang, '')
    if(speaking.speaker!==synth) return;
    return new Promise(resolve=>{
      utter.onend=resolve
      utter.onerror=resolve
      synth.speak(utter)
    })
  }

  let lastPos=0
  const speakStream=async (sentence, lang='ja-JP')=>{
    const newText=sentence.substr(lastPos)
    const [, textToSpeak] = newText.match(/^([\s\S]+[。！？?!.\n]|$)|$/);
    if (!textToSpeak) return;
    lastPos+=textToSpeak.length
    return speak(textToSpeak, lang)
  }

  return {speak, speakStream}
}

export function stop() {
  if(!support()) return;
  speaking.speaker?.cancel()
  speaking.speaker=null
}
