<?js

const crypto = require('crypto')
const path = require('path')
const fs = require('fs')

class storageController extends apiController{
  async init(...argv) {
    FileHelper.mkdirSync(__STORAGE_DIR__)
    FileHelper.mkdirSync(__STORAGE_DIR_UPLOAD__)
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

  async displayFileAction() {
    const rawFilename = $_QUERY.file || ''
    if (rawFilename.includes('..')) throw new Error('不正なファイルパスです')
    const safePath = path.normalize('/' + rawFilename).slice(1)
    this.sendFile(__STORAGE_DIR_UPLOAD__ + '/' + safePath)
  }
  async uploadFileAction() {
    const file = this.postData?.file?.[0]
    if (!file || typeof file !== 'object' || typeof file.filepath !== 'string' || typeof file.originalFilename !== 'string') {
      throw new Error('アップロードされたファイルがありません')
    }

    const ext = path.extname(file.originalFilename) || ''
    const randomName = crypto.randomBytes(16).toString('hex') + ext
    const targetPath = __STORAGE_DIR_UPLOAD__ + '/' + randomName

    fs.copyFileSync(file.filepath, targetPath)

    return {
      savedName: randomName,
      originalName: file.originalFilename,
    }
  }
  async removeFileAction() {
    const savedName = (this.postData?.savedName || '').trim()
    if (!savedName) throw new Error('ファイル名が指定されていません')
    if (savedName.includes('..')) throw new Error('不正なファイルパスです')

    const targetPath = path.normalize(__STORAGE_DIR_UPLOAD__ + '/' + savedName)
    if (!targetPath.startsWith(__STORAGE_DIR_UPLOAD__ + '/')) {
      throw new Error('不正なファイルパスです')
    }

    if (!FileHelper.existsFile(targetPath)) {
      throw new Error('ファイルが見つかりません')
    }

    fs.unlinkSync(targetPath)
    return { removed: savedName }
  }
}
