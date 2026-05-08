/**
 * @description 右側からスライドインする汎用モーダルコンテナ
 * @created 2026-04-14
 * @usage <Modal isOpen={isOpen} onClose={onClose}><Content /></Modal>
 */
import React, { useEffect } from 'react';
import './index.scss';
import { useDarkMode } from '@/store/globalSettingStore';
import {registerId} from '@/store/modalButton'
import modalZIndexStore, { getNextModalZIndex } from '@/store/modalZIndexStore';

function Modal({ isOpen, onClose, children }) {
  const [zIndex, setZIndex] = React.useState(modalZIndexStore.getValue());

  useEffect(() => {
    if (isOpen) {
      const val=modalZIndexStore.getValue()+1
      modalZIndexStore.setValue(val)
      setZIndex(val)
    }
  }, [isOpen]);

  return (
    <div
      className={`modal-container ${isOpen ? 'open' : ''}`}
      style={{zIndex}}
      onMouseDown={e=>{
        e.stopPropagation()
      }}
      onDoubleClick={e=>{
        e.stopPropagation()
      }}
    >
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
