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
    const appDir=path.resolve('.')
    const msgs=[
      {
        role: 'user',
        content: `<Tree>\n${FileHelper.walkDir(appDir+'/src', (fn, isDir)=>{
          return fn.match(/\.(scss|jsx?)$/) || isDir
        }).map(x=>'src/'+x).join('\n')}\n</Tree>`,
      }
    ]
    for(const {md, txt} of any) {
      const text=md? FileHelper.readTextFile(md): txt
      const files=[]
      const mdStr=text.replace(/<external-files>([\s\S]+?)<\/external-files>/g, (_, requires)=>{
        requires.replace(/<file>(.+?)<\/file>/g, (_, name)=>{
          const originalName=name.trim()
          const fullname=__DEV_WWW_DIR__+'/'+originalName
          if(FileHelper.existsFile(fullname)) {
            const code=FileHelper.readTextFile(fullname)
            const codeWithLineNum=code.split('\n').map((x, i)=>`/* LINE ${i+1} */ ${x}`).join('\n')
            files.push(`<code-file path="${originalName}">\n${codeWithLineNum}\n</code-file>`)
          }
        })
        return ''
      })
      msgs.push({
        role: 'user',
        content: mdStr,
      })
      for(let file of files) {
        msgs.push({role: 'user', content: file})
      }
    }
    msgs.push(
      {
        role: 'user',
        content: 'Now is '+(new Date).toUTCString(),
      },
      {
        role: 'user',
        content: FileHelper.loadSptcDocumentFile(__DOC_DIR__+'/system/global.md.s', this.systemSetting)
      },
    )
    return await helper.startStreamEcho(msgs.filter(x=>x.content))
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

      const fullname=appDir+'/'+fn
      if(x[fn][0].create || !FileHelper.existsFile(fullname)) {
        fs.writeFileSync(fullname, x[fn][0].code)
      }else{
        const source=FileHelper.readTextFile(fullname)
        const lines=source.split('\n')
        for(let item of x[fn]) {
          const {code, startLine, endLine}=item
          lines[startLine-1]=code
          for(let i=startLine; i<endLine; i++) {
            lines[i]=null
          }
        }
        fs.writeFileSync(fullname, lines.filter(x=>x!==null).join('\n'))
      }
      writes.push(fullname)
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
