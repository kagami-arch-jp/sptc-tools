import React from 'react';
import './index.scss';

import Modal from '@/components/Modal'
import { darkMode } from '@/store/darkMode';

export default function({className, text, children}) {
  const [isOpen, setIsOpen]=React.useState(false)
  function onClose() {
    setIsOpen(false)
  }
  const isDarkMode = darkMode.useValue();
  return <>
    <div className={`modal-button ${isDarkMode? 'dark-mode': ''} ${className || ''}`} onClick={()=>{
      setIsOpen(true)
    }}>
      {text}
    </div>
    <Modal isOpen={isOpen} onClose={onClose}>{children}</Modal>
  </>
}
