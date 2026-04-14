/**
 * @description 設定パネルを開くための正方形ボタン
 * @created 2026-04-14
 * @usage <SettingButton onClick={openModal} />
 */
import React from 'react';
import './index.scss';

import Modal from '@/components/Modal'
import SettingPanel from '@/components/SettingPanel'
import { darkMode } from '@/store/darkMode';

function SettingButton({ onClick }) {
  const isDarkMode = darkMode.useValue();
  return (
    <div className={`setting-button ${isDarkMode? 'dark-mode': ''}`} onClick={onClick}>
      ⚙️
    </div>
  );
}

export default function() {
  const [isOpen, setIsOpen]=React.useState(false)
  function onClose() {
    setIsOpen(false)
  }
  return <>
    <SettingButton onClick={()=>{
      setIsOpen(true)
    }} />
    <Modal isOpen={isOpen} onClose={onClose}><SettingPanel /></Modal>
  </>
}
