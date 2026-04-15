import React from 'react'
import './App.scss'

import {initialStoreValues, updateValues} from '@/store/storage'
import {loadStorageValues} from '@/api/storage'

import Tool from '@/components/Tool'

export async function init(payload) {
  payload=payload || await loadStorageValues()
  initialStoreValues.setValue(payload)
  updateValues(payload)
  return payload
}

export default function() {
  return <Tool />
}
