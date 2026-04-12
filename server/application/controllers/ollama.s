<?js

const path=require('path')
const fs=require('fs')

class ollamaController extends apiController{

  async _callOllamaEcho(md) {
    const {
      requirement,
      apiKey,
      model,
      temperature=0,
      contextLength=8192,
    }=this.postData

    this.setAsStreamResponse()

    const helper=new OllamaHelper({
      apiKey,
      model,
      temperature,
      contextLength,
      think: false,
    })
    helper.unbind()
    return await helper.startStreamEcho([
      {
        role: 'user',
        content: 'Now is '+(new Date).toUTCString(),
      },
      {
        role: 'user',
        content: FileHelper.loadMarkdownFile(__FE_DOC__+'/basicRules.md'),
      },
      {
        role: 'user',
        content: FileHelper.loadMarkdownFile(md),
      },
      {
        role: 'user',
        content: requirement,
      }
    ])
  }

  async generateAnalysisAction() {
    await this._callOllamaEcho(__FE_DOC__+'/1-rewritePRD.md')
  }

  async generateCodeAction() {
    await this._callOllamaEcho(__FE_DOC__+'/2-generateCode.md')
  }

  getWorkdirAction() {
    return path.resolve('.')
  }

  writeToFileAction() {
    const appDir=path.resolve('.')
    const x=this.postData.codeFiles
    const writes=[]
    for(const fn in x) {
      const dir=path.normalize(appDir+'/'+fn+'/..')
      try{
        fs.mkdirSync(dir, {recursive: true})
      }catch(e){}
      fs.writeFileSync(appDir+'/'+fn, x[fn].code)
      writes.push(appDir+'/'+fn)
    }
    return `Wrote files: \n${writes.join('\n')}`
  }

  async listModelsAction() {
    const {apiKey}=this.postData
    const helper=new OllamaHelper({apiKey})
    const { models } = await helper.callApi('list')
    const ls=models.map(m=>({name: m.name})).sort((a, b)=>{
      return a.name.charCodeAt(0)-b.name.charCodeAt(0)
    })
    ls.unshift({name: '-- not selected --'})
    return ls
  }
}
