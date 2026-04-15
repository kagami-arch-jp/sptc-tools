<?js

class storageController extends apiController{
  async init(...argv) {
    FileHelper.mkdirSync(__STORAGE_DIR__)
    await super.init(...argv)
  }
  async saveAction() {
    const {key, value}=this.postData
    if(!key) return false
    const fn=__STORAGE_DIR__+'/s-'+encodeURIComponent(key)+'-'+typeof(value)+'.json'
    FileHelper.writeFile(fn, typeof value==='string'? value: JSON.stringify(value))
    return true
  }
  async loadAction() {
    const data={}
    const files=FileHelper.walkDir(__STORAGE_DIR__, (name, isDir)=>{
      return !isDir && name.match(/^s\-.+?\.json$/)
    })
    for(const fn of files) {
      encodeURIComponent(fn).replace(/^s\-(.+?)\-([a-zA-Z\d]+)\.json$/, (_, key, typestr)=>{
        const value=FileHelper.readTextFile(__STORAGE_DIR__+'/'+fn)
        data[key]=typestr==='string'? value: JSON.parse(value)
      })
    }
    return data
  }
}
