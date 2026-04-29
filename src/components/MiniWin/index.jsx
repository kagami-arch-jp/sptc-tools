/**
 * @file MiniWin Component
 * @description ドラッグ・リサイズ・Z-Index管理が可能なマルチウィンドウコンポーネント
 * @features
 * - ウィンドウのドラッグ移動
 * - ウィンドウのリサイズ
 * - Z-Indexの自動管理（最前面表示）
 * - ダークモード対応
 * - フェードアニメーション
 * @created 2026/04/14
 * @usage
 * <MiniWin
 *   id="win1"
 *   title="ウィンドウ1"
 *   isOpen={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   initialPosition={{ x: 100, y: 100 }}
 *   initialSize={{ width: 400, height: 300 }}
 * />
 */
import {cls} from '@/utils/css'
import React, { useState, useEffect, useRef } from 'react';
import { zIndexStore, bringToFront } from '@/store/zIndexStore';
import { useDraggable } from '@/hooks/useDraggable';
import { useResizable } from '@/hooks/useResizable';
import { getElementRect } from '@/utils/domUtils';
import ResizeHandle from './ResizeHandle';

import {useGlobalSetting} from '@/store/globalSettingStore'

import { ModalButton } from '@/components/Modal';
import SettingPanelCommon from '@/components/SettingPanelCommon';
import './index.scss';

/**
 * @param {Object} props
 * @param {string} props.id - ウィンドウの一意識別子
 * @param {string} props.title - タイトルバーに表示するテキスト
 * @param {boolean} props.isOpen - 表示/非表示の制御
 * @param {Function} props.onClose - 閉じるボタンが押された時のコールバック
 * @param {Object} props.initialPosition - 初期座標 {x, y}
 * @param {Object} props.initialSize - 初期サイズ {width, height}
 * @param {React.ReactNode} props.children - コンテンツエリアの内容
 */
const MiniWin = ({ id, title, initIsOwner, isOpen, onClose, initialPosition, initialSize, btns, config, settingKey, children }) => {
  const [position, setPosition] = useState(initialPosition);
  const [size, setSize] = useState(initialSize);
  const isDarkMode = useGlobalSetting('darkMode')

  const [showed, setShowed]=React.useState(false)
  React.useEffect(()=>{
    if(showed) return;
    if(isOpen) setShowed(true)
  }, [isOpen])

  const windowRef = useRef(null);
  const contentRef = useRef(null);

  const [isBrowser, setIsBrowser]=React.useState(false)
  React.useEffect(()=>{
    setIsBrowser(true)
  }, [])

  // Z-Index 管理
  const { maxZ, activeIds } = zIndexStore.useValue();
  const currentZIndex = activeIds.includes(id)
    ? Math.max(...activeIds.map(aid => activeIds.indexOf(aid))) // 簡易的な重なり計算
    : 10;
  // 実際には storeのmaxZを利用して、activeIdsの最後にあるものを最前面とする
  const zIndex = activeIds.includes(id) ? activeIds.indexOf(id) + 100 : 100;

  // クリック時に最前面へ
  const handleWindowFocus = () => {
    bringToFront(id);
  };

  const [isOwner, setIsOwner]=React.useState(initIsOwner)

  const resetHandler=React.useEffectEvent(()=>{
    const MIN_WIDTH=160, MIN_HEIGHT=80
    let width=size.width, height=size.height
    if(size.width>innerWidth-20 || size.height>innerHeight-20) {
      width=innerWidth-position.x-20
      height=innerHeight-position.y-20
      setSize({width, height})
    }
    if(size.width<MIN_WIDTH || size.height<MIN_HEIGHT) {
      width=MIN_WIDTH
      height=MIN_HEIGHT
      setSize({width, height})
    }
    if(position.x<10 || position.x>innerWidth-width-10 ||
      position.y<10 || position.y>innerHeight-height-10
    ) {
      setPosition(prev=>({
        x: Math.min(innerWidth-width-10, Math.max(10, prev.x)),
        y: Math.min(innerHeight-height-10, Math.max(10, prev.y)),
      }))
    }
  })

  React.useEffect(()=>{
    window.addEventListener('resize', resetHandler)
    return ()=>{
      window.removeEventListener('resize', resetHandler)
    }
  }, [])

  const updateBodyOverflow=React.useEffectEvent(()=>{
    document.body.style.overflow=isOwner? 'hidden': 'auto'
  })
  React.useEffect(updateBodyOverflow, [isOwner])

  // ドラッグロジック
  const { startDrag } = useDraggable(
    (newx, newy) => {
      setPosition(prev => ({
        x: newx,
        y: newy
      }));
    },
    resetHandler
  );

  // リサイズロジック
  const { startResize } = useResizable(
    (newWidth, newHeight) => {
      setSize({
        width: newWidth,
        height: newHeight,
      });
    },
    resetHandler
  );

  // 外部からisOpenが変わった時の制御
  useEffect(() => {
    if (isOpen) {
      handleWindowFocus();
      updateBodyOverflow();
    }else{
      document.body.style.overflow='auto'
    }
  }, [isOpen, id]);

  const wrapper=content=><div
    ref={windowRef}
    className={cls(
      `mini-win-container`,
      isOpen ? 'opened': 'closed',
      isDarkMode && 'dark-mode',
      isOwner && 'owner-win',
    )}
    style={(()=>{
      const style={
        zIndex,
      }
      if(!isOwner && (isOpen || isBrowser)) {
        Object.assign(style, {
          left: position.x,
          top: position.y,
          width: size.width,
          height: size.height,
        })
      }
      return style
    })()}
    onClick={handleWindowFocus}
  >{content}</div>

  return showed? wrapper(
    isOpen || isBrowser?
      <><div
        className="mini-win-titlebar"
        onDoubleClick={e=>{
          setIsOwner(!isOwner)
        }}
        onMouseDown={(e) => {
          handleWindowFocus(id)
          startDrag(e, { x: position.x, y: position.y })
        }}
      >
        <span className="title-text">{title}</span>
        <div className='btn-area'>
          {btns}
          {config && settingKey && (
            <ModalButton id={`${settingKey}-modal`} text="⚙">
              <SettingPanelCommon settingKey={settingKey} config={config} />
            </ModalButton>
          )}
          <div className="close-button" onClick={onClose}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 1L13 13M1 13L13 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
        </div>
      </div>

      <div className="mini-win-content" ref={contentRef}>
        {children}
      </div>

      <ResizeHandle
        onResizeStart={(e) => startResize(e, size)}
      />
    </>:
    null
  ): wrapper()
};

export default MiniWin;
