/**
 * @description 右側からスライドインする汎用モーダルコンテナ
 * @created 2026-04-14
 * @usage <Modal isOpen={isOpen} onClose={onClose}><Content /></Modal>
 */
import React from 'react';
import './index.scss';
import { useDarkMode } from '@/store/globalSettingStore';
import {registerId} from '@/store/modalButton'

function Modal({ isOpen, onClose, children }) {
  return (
    <div className={`modal-container ${isOpen ? 'open' : ''}`} onMouseDown={e=>{
      e.stopPropagation()
    }} onDoubleClick={e=>{
      e.stopPropagation()
    }}>
      <div className="modal-overlay" onClick={onClose} />
      <div className="modal-content">
        {children}
      </div>
    </div>
  );
}

function ModalButton({id, className, text, children}) {
  const [isOpen, setIsOpen]=React.useState(false)
  function onClose() {
    setIsOpen(false)
  }
  React.useEffect(()=>{
    return registerId(id, ()=>setIsOpen(true), ()=>setIsOpen(false))
  }, [])
  const isDarkMode = useDarkMode();
  return <>
    <div className={`modal-button ${isDarkMode? 'dark-mode': ''} ${className || ''}`} onClick={()=>{
      setIsOpen(true)
    }}>
      {text}
    </div>
    <Modal isOpen={isOpen} onClose={onClose}>{children}</Modal>
  </>
}

export { Modal, ModalButton };
export default Modal;
