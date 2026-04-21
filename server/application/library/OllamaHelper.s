<?js

const {default: ollama, Ollama}=require('ollama');

class OllamaHelper{
  constructor({apiKey, model, temperature, contextLength, think}) {
  	this.key=apiKey || ''
    this.model=model || ''
    this.temperature=temperature || 0
    this.contextLength=contextLength || 8192
    this.think=this.think || false
    Application.OLLAMA_CLIENTS=Application.OLLAMA_CLIENTS || {}
  }
  async callApi(apiMethod, { onData, query } = {}) {
    // API キーがあれば認証付きクライアント、無ければデフォルトクライアント
    const client = this.key
      ? new Ollama({
          host: 'https://ollama.com',
          headers: { Authorization: 'Bearer ' + this.key }
        })
      : ollama;

    try{
      const response = await client[apiMethod](query);

      // onData が無い場合は単なる結果オブジェクトを返す
      if (!onData) return response;

      this.bind(client)

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

    this.unbind()
  }
  bind(c) {
    Application.OLLAMA_CLIENTS[this.key]=c
  }
  unbind(destory=true) {
    if(destory) {
      Application.OLLAMA_CLIENTS[this.key]?.abort?.()
    }
    delete Application.OLLAMA_CLIENTS[this.key]
  }
  async startStreamEcho(msg) {
    let res='', think=true
    await this.callApi('chat', {
      query: {
        stream: true,
        model: this.model,
        messages: msg,
        think: this.think,
        options: {
          temperature: this.temperature,
          num_ctx: this.contextLength,
        },
      },
      onData: (err, isEnd, part) => {
        if (err) {
          console.log({ err: err.message });
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
            echo(content)
            flush()
            process.stdout.write(content)
            res+=content
          }
        }
      },
    })

    return res
  }
  async startGenerateImage(option, onData) {
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
          echo('Error: '+err.message)
        } else if (part) {
          console.log(part)
          const {total, completed, image}=part
          onData(Math.round(completed/total*100 || 0), image)
        }
      },
    })
  }
}
