import createSharedState from 'react-cross-component-state';

const speechStore=createSharedState({
  isSpeaking: false,
})

const speaker={current: null}

export default speechStore

function support() {
  return window.speechSynthesis && true
}

speechStore.speak=async (lang, text)=>{
  if(!support()) return;
  speechStore.setValue({isSpeaking: true})
  const current=await new Promise(resolve=>{
    const synth = window.speechSynthesis;
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = lang || 'ja-JP'
    utter.voice=window.speechSynthesis.getVoices().filter(x=>x.lang=='ja-JP' && x.name.match(/google/i))[0]
    speaker.current=synth
    const stop=()=>{
      resolve(synth)
    }
    utter.onend=()=>stop()
    utter.onerror=()=>stop()
    synth.speak(utter)
  })
  speechStore.stop(current)
}
speechStore.stop=(current)=>{
  if(current===speaker.current || !current) {
    speaker.current?.cancel()
    speaker.current=null
    speechStore.setValue({isSpeaking: false})
  }
}
