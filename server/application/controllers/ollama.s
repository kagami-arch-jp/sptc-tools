<?js

const path=require('path')
const fs=require('fs')

const __FE_DOC__=__DOC_DIR__+'/codeAgent/frontend-react'

function fmtTime() {
  const t=new Date
  return `${t.getFullYear()}/${t.getMonth()+1}/${t.getDate()} ${t.getHours()}:${t.getMinutes()}:${t.getSeconds()} ${'日月火水木金土'[t.getDay()]}曜日`
}

class ollamaController extends apiController{

  _initOllama() {
    const {
      apiKey,
      model,
      temperature=0,
      contextLength=8192,
      language='English',
      tone='human',
    }=this.postData
    this.systemSetting={
      humanTone: tone==='human',
      lang: language,
    }
    this.setAsStreamResponse()
    const helper=new OllamaHelper({
      apiKey,
      model,
      temperature,
      contextLength,
      think: false,
    })
    helper.unbind(true)
    return helper
  }

  async _callOllamaEcho(...any) {
    const helper=this._initOllama()
    const msgs=[]
    msgs.push(
      {
        role: 'user',
        content: 'Now is '+fmtTime(),
      },
      {
        role: 'user',
        content: FileHelper.loadSptcDocumentFile(__DOC_DIR__+'/system/global.md.s', this.systemSetting)
      },
    )
    return await helper.startStreamEcho(msgs.filter(x=>x.content))
  }

  async listModelsAction() {
    const {apiKey}=this.postData
    const helper=new OllamaHelper({apiKey})
    const { models } = await helper.callApi('list')
    const ls=models.map(m=>({name: m.name})).sort((a, b)=>{
      return a.name.charCodeAt(0)-b.name.charCodeAt(0)
    })
    ls.unshift({name: '-- no model selected --'})
    return ls
  }

  async generateImageAction() {
    const helper=this._initOllama()
    const {
      prompt,
      size,
      steps,
    }=this.postData
    await helper.startGenerateImage({
      prompt,
      width: size,
      height: size,
      steps,
    })
  }

  async writerSuggestionAction() {

    const {txt, role, queryType}=this.postData

    if(!txt) return;

    await this._callOllamaEcho(
      {txt: role},
      {md: ({
        after: __DOC_DIR__+'/writer/After.md',
        rewrite: __DOC_DIR__+'/writer/Rewrite.md',
        expand: __DOC_DIR__+'/writer/Expand.md',
      })[queryType]},
      {txt},
    )

  }

  async chatAction() {
    const {history, who='mennsetsu'}=this.postData
    if(!history) return;
    const helper=this._initOllama()
    const msgs=[
      {
        role: 'user',
        content: 'Now is '+fmtTime(),
      },
      who==='chat' && {
        role: 'user',
        content: FileHelper.loadSptcDocumentFile(__DOC_DIR__+'/chatBot/0-chat.md.s', {
          lang: this.systemSetting.lang,
        }),
      },
      who==='mennsetsu' && {
        role: 'user',
        content: FileHelper.loadSptcDocumentFile(__DOC_DIR__+'/chatBot/0-mennsetsu.md.s', {
          lang: this.systemSetting.lang,
        }),
      },
      {
        role: 'user',
        content: FileHelper.loadSptcDocumentFile(__DOC_DIR__+'/system/global.md.s', this.systemSetting)
      },
      ...history
    ].filter(x=>x?.content)
    return await helper.startStreamEcho(msgs)
  }
  async chatSummaryAction() {
    const {history}=this.postData
    if(!history) return;
    const helper=this._initOllama()
    const msgs=[
      {
        role: 'user',
        content: FileHelper.readTextFile(__DOC_DIR__+'/chatBot/summary.md'),
      },
      ...history
    ].filter(x=>x.content)
    return await helper.startStreamEcho(msgs)
  }
  async chatUserImageAction() {
    const {history}=this.postData
    if(!history) return;
    const helper=this._initOllama()
    const msgs=[
      {
        role: 'user',
        content: FileHelper.loadSptcDocumentFile(__DOC_DIR__+'/chatBot/userImage.md.s', {
          lang: this.systemSetting.lang,
        }),
      },
      ...history
    ].filter(x=>x.content)
    return await helper.startStreamEcho(msgs)
  }


}
