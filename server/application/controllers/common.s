<?js

class commonController extends apiController{
  async aliveAction() {
    this.setAsStreamResponse()
    for(let i=0; i<30; i++) {
      await Utils.sleep(1e3)
      echo(JSON.stringify({alive: true, time: Date.now()})+'\n')
      flush()
    }
    echo(JSON.stringify({done: true})+'\n')
  }
}
