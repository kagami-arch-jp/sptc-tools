<?js

const {default: ollama, Ollama}=require('ollama');

const clients=(
  Application.OLLAMA_CLIENTS_SET=Application.OLLAMA_CLIENTS_SET || new Set
)

class OllamaHelper{
  constructor({apiKey, model, temperature, contextLength, think}) {
  	this.key=apiKey || ''
    this.model=model || ''
    this.temperature=temperature || 0
    this.contextLength=contextLength || 8192
    this.think=this.think || false
  }

  static destoryAllClients() {
    for(const resolver of [...clients]) {
      resolver.resolve()
    }
  }

  async callApi(apiMethod, { onData, query } = {}) {
    // API キーがあれば認証付きクライアント、無ければデフォルトクライアント
    const client = this.key
      ? new Ollama({
          host: 'https://ollama.com',
          headers: { Authorization: 'Bearer ' + this.key }
        })
      : ollama;
    const resolver=Utils.PromiseWithResolvers()
    resolver.promise.then(()=>{
      clients.delete(resolver)
      client?.abort?.()
    })
    clients.add(resolver)

    try{
      const response = await Promise.race([
        client[apiMethod](query),
        resolver.promise,
      ])

      if(!response) throw new Error('cancelled')

      // onData が無い場合は単なる結果オブジェクトを返す
      if (!onData) return response;

      if(!clients.has(resolver)) throw new Error('cancelled')

      // ストリーミング結果をコールバックで流す
      try {
        for await (const part of response) {
          onData(null, false, part);
        }
        onData(null, true, null);
      } catch (e) {
        throw e
      }
    }catch(e) {
      if(!onData) throw e
      onData(e, true, null);
    }

    resolve.resolve()
  }
  async startStreamEcho(msg) {
    // let res='', think=true
    let hasError=false
    let think=true
    await this.callApi('chat', {
      query: {
        stream: true,
        model: this.model,
        messages: msg,
        think: this.think,
        keep_alive: "15m",
        options: {
          temperature: this.temperature,
          num_ctx: this.contextLength,
        },
      },
      onData: (err, isEnd, part) => {
        if (err) {
          console.log({ err: err.message });
          echo(JSON.stringify({err: err.message})+'\n')
          hasError=true
          // echo('Error: '+err.message)
        } else if (part) {
          const { content, thinking } = part.message;
          if(thinking) {
            process.stdout.write(thinking)
          }else if(content) {
            if(think) {
              think=false
              console.log('\n')
            }
            // echo(content)
            echo(JSON.stringify({content})+'\n')
            flush()
            process.stdout.write(content)
            // res+=content
          }
        }
      },
    })
    if(!hasError) {
      echo(JSON.stringify({done: true})+'\n')
    }

    // return res
  }
  async startGenerateImage(option) {
    let hasError=false
    await this.callApi('generate', {
      query: {
        stream: true,
        model: this.model,
        width: 256,
        height: 256,
        steps: 3,
        ...option
      },
      onData: (err, isEnd, part) => {
        if (err) {
          console.log({ err: err.message });
          // echo('Error: '+err.message)
          echo(JSON.stringify({err: err.message})+'\n')
          hasError=true
        } else if (part) {
          console.log(part)
          const {total, completed, image}=part
          // onData(Math.round(completed/total*100 || 0), image)
          const progress=Math.round(completed/total*100 || 0)
          if(!image) {
            echo(JSON.stringify({progress})+'\n')
          }else{
            echo(JSON.stringify({progress: 100, image})+'\n')
          }
          flush()
        }
      },
    })
    if(!hasError) {
      echo(JSON.stringify({done: true})+'\n')
    }
  }
}
