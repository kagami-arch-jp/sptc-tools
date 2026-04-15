<?js

const path=require('path')
const fs=require('fs')

const __FE_DOC__=__DOC_DIR__+'/codeAgent/frontend-react'

class ollamaController extends apiController{

  _initOllama() {
    const {
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
    helper.unbind(true)
    return helper
  }

  async _callOllamaEcho(...any) {
    const helper=this._initOllama()
    return await helper.startStreamEcho([
      {
        role: 'user',
        content: 'Now is '+(new Date).toUTCString(),
      },
      ...any.map(x=>({
        role: 'user',
        content: x.md? FileHelper.loadMarkdownFile(x.md): x.txt,
      }))
    ].filter(x=>x.content))
  }

  async generateAnalysisAction() {
    await this._callOllamaEcho(
      {md: __FE_DOC__+'/basicRules.md'},
      {md: __FE_DOC__+'/1-rewritePRD.md'},
      {txt: this.postData.requirement},
    )
  }

  async generateCodeAction() {
    await this._callOllamaEcho(
      {md: __FE_DOC__+'/basicRules.md'},
      {md: __FE_DOC__+'/2-generateCode.md'},
      {txt: this.postData.requirement},
    )
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
    }, (progress, image)=>{
      if(progress) {
        echo(JSON.stringify({progress})+'\n')
        flush()
      }else if(image) {
        echo(JSON.stringify({progress: 100, image})+'\n')
        flush()
      }
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

  async answerTheContentAction() {
    const {documentContent, question}=this.postData

    if(!documentContent || !question) return;

    await this._callOllamaEcho(
      {md: __DOC_DIR__+'/answer/basic.md'},
      {txt: `<Content>\n${documentContent}\n</Content>`},
      {txt: `<Question>\n${question}\n</Question>`},
    )
  }


}
