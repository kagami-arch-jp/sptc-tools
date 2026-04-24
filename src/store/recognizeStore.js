import createSharedState from 'react-cross-component-state';

const recognizeStore=createSharedState({
  isRecognizing: false,
  text: '',
})

const recorder={current: null}

export default recognizeStore

function support() {
  return window.SpeechRecognition || window.webkitSpeechRecognition
}

recognizeStore.start=async (lang)=>{
  if(!support() || recognizeStore.getValue().isRecognizing) return;
  recognizeStore.setValue({isRecognizing: true, text: ''})
  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  recognition.lang = lang || 'ja-JP'
  recognition.continuous = true
  recognition.onresult = (event) => {
    const transcript = event.results[event.results.length - 1][0].transcript;
    recognizeStore.setValue(prev=>({
      ...prev,
      text: prev.text+transcript,
    }))
  }
  recorder.current=recognition
  recognition.start()
}
recognizeStore.stop=()=>{
  recorder.current?.stop()
  recorder.current=null
  recognizeStore.setValue({isRecognizing: false})
}
