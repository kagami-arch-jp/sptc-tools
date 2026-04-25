import React from 'react'
import './App.scss'
import './scss/ios-system.scss'

// @ts-ignore
import {initialStoreValues, updateValues} from '@/store/storage'

import {loadStorageValues} from '@/api/storage'

// @ts-ignore
import Tool from '@/components/Tool'

export async function init(payload: object) {
  payload=payload || await loadStorageValues()
  initialStoreValues.setValue(payload)
  updateValues(payload)
  return payload
}

export default function() {
  return <Tool />
}
