/**
 * @description 右側からスライドインする汎用モーダルコンテナ
 * @created 2026-04-14
 * @usage <Modal isOpen={isOpen} onClose={onClose}><Content /></Modal>
 */
import React from 'react';
import './index.scss';

function Modal({ isOpen, onClose, children }) {
  return (
    <div className={`modal-container ${isOpen ? 'open' : ''}`}>
      <div className="modal-overlay" onClick={onClose} />
      <div className="modal-content">
        {children}
      </div>
    </div>
  );
}

export default Modal;