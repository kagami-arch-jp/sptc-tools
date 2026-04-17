import React from 'react'
import './index.scss'

export default function(props) {
  const {
    msg='回答を生成中...'
  }=props
  return <div className="loading-spinner">
    <div className="spinner"></div>
    <span>{msg}</span>
  </div>
}
