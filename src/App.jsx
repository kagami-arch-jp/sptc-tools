import React from 'react'
import './App.scss'

import Tool from '@/components/Tool'

export default function() {
  const [isOpen, setIsOpen]=React.useState(false)
  return <>
    <Tool />
  </>
}
