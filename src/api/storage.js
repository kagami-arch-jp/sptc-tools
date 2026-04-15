import {fetch} from '@/utils/fetch'

export async function loadStorageValues() {
  return await fetch('/storage/load')
}
export async function saveToStorage(key, value) {
  return await fetch('/storage/save', {key, value})
}
