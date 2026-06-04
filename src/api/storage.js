import {fetch} from '@/utils/fetch'

export async function loadStorageValues() {
  return await fetch('/storage/load')
}
export async function saveToStorage(key, value) {
  return await fetch('/storage/save', {key, value})
}

export async function uploadFile(file) {
  const formData = new FormData()
  formData.append('file', file)

  const url = "@IS_DEV" === "true" ? location.origin + '/storage/uploadFile' : '/storage/uploadFile'

  const res = await window.fetch(url, {
    method: 'POST',
    body: formData,
    credentials: 'include',
  })
  const json = await res.json()
  if (!json.success) throw new Error(json.errMsg || 'アップロード失敗')
  return json.data
}

export async function removeFile(file) {
  return await fetch('/storage/removeFile', {savedName: file})
}

export function toDisplayLink(file) {
  const prefix= "@IS_DEV" === "true" ? location.origin + '/storage/displayFile' : '/storage/displayFile'
  return prefix+'?file='+file
}
