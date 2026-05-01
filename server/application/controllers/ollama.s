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
      tone='',
    }=this.postData
    this.systemSetting={
      humanTone: tone==='human',
      tsuxtsukomiTone: tone==='tsuxtsukomi',
      lang: language,
    }
    this.setAsStreamResponse()
    OllamaHelper.destoryAllClients()
    const helper=new OllamaHelper({
      apiKey,
      model,
      temperature,
      contextLength,
      think: false,
    })
    return helper
  }

  async resetAction() {
    OllamaHelper.destoryAllClients()
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
      ...any
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
      width: parseInt(size)+parseInt(size)%2,
      height: parseInt(size)+parseInt(size)%2,
      steps: parseInt(steps),
    })
  }

  async writerSuggestionAction() {

    const {txt, role, queryType}=this.postData

    if(!txt) return;

    await this._callOllamaEcho(...[
      role,
      FileHelper.readTextFile(({
        after: __DOC_DIR__+'/writer/After.md',
        rewrite: __DOC_DIR__+'/writer/Rewrite.md',
        expand: __DOC_DIR__+'/writer/Expand.md',
      })[queryType]),
      txt,
    ].map(x=>({role: 'user', content: x})))
  }

  async _debugStreamResponse() {
    this._initOllama()
    for(let i=0; i<10; i++) {
      await Utils.sleep(2e2)
      echo(JSON.stringify({content: 'xx'})+'\n')
      flush()
    }
    echo(JSON.stringify({done: true})+'\n')
  }

  async chatAction() {
    //await this._debugStreamResponse()
    //return;

    const {history, who='mennsetsu'}=this.postData
    if(!history) return;
    const helper=this._initOllama()
    const msgs=[
      {
        role: 'user',
        content: 'Now is '+fmtTime(),
      },

      {
        role: 'user',
        content: FileHelper.loadSptcDocumentFile(__DOC_DIR__+'/chatBot/0-'+who.match(/[a-z\d]+|$/)[0]+'.md.s', {
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
    //await this._debugStreamResponse()
    //return;

    const {history}=this.postData
    if(!history) return;
    const helper=this._initOllama()
    const msgs=[
      {
        role: 'user',
        content: FileHelper.loadSptcDocumentFile(__DOC_DIR__+'/chatBot/summary.md.s', {
          lang: this.systemSetting.lang,
        }),
      },
      ...history
    ].filter(x=>x.content)
    return await helper.startStreamEcho(msgs)
  }
  async chatUserImageAction() {
    //await this._debugStreamResponse()
    //return;

    const {history, isMerge}=this.postData
    if(!history) return;
    const helper=this._initOllama()
    const msgs=[
      isMerge? {
        role: 'user',
        content: FileHelper.loadSptcDocumentFile(__DOC_DIR__+'/chatBot/1-userImage-merge.md.s', {
          lang: this.systemSetting.lang,
        }),
      }: {
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
