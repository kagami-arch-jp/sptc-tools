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
import { darkMode } from '@/store/darkMode';
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
const MiniWin = ({ id, title, isOpen, onClose, initialPosition, initialSize, children }) => {
  const [position, setPosition] = useState(initialPosition);
  const [size, setSize] = useState(initialSize);
  const isDarkMode = darkMode.useValue();

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

  // ドラッグロジック
  const { startDrag } = useDraggable(
    (newx, newy) => {
      setPosition(prev => ({
        x: newx,
        y: newy
      }));
    },
    () => {
      setPosition(prev=>({
        x: Math.min(innerWidth-size.width-10, Math.max(10, prev.x)),
        y: Math.min(innerHeight-size.height-10, Math.max(10, prev.y)),
      }))
    }
  );

  // リサイズロジック
  const { startResize } = useResizable((newWidth, newHeight) => {
    setSize({
      width: Math.min(innerWidth-position.x-10, Math.max(200, newWidth)),
      height: Math.min(innerHeight-position.y-10, Math.max(150, newHeight))
    });
  });

  // 外部からisOpenが変わった時の制御
  useEffect(() => {
    if (isOpen) {
      handleWindowFocus();
    }
  }, [isOpen, id]);

  return (
    <div
      ref={windowRef}
      className={cls(
        `mini-win-container`,
        isOpen ? 'opened': 'closed',
        isDarkMode && 'dark-mode',
      )}
      style={isOpen || isBrowser? {
        left: position.x,
        top: position.y,
        width: size.width,
        height: size.height,
        zIndex: zIndex
      }: null}
      onClick={handleWindowFocus}
    >
      {isOpen || isBrowser? <><div
        className="mini-win-titlebar"
        onDoubleClick={e=>{
          setSize({
            width: innerWidth-20,
            height: innerHeight-20,
          })
          setPosition({
            x: 10,
            y: 10,
          })
        }}
        onMouseDown={(e) => {
          handleWindowFocus(id)
          startDrag(e, { x: position.x, y: position.y })
        }}
      >
        <span className="title-text">{title}</span>
        <div className="close-button" onClick={onClose}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 1L13 13M1 13L13 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>
      </div>

      <div className="mini-win-content" ref={contentRef}>
        {children}
      </div>

      <ResizeHandle
        onResizeStart={(e) => startResize(e, size)}
      />
      </>:null}
    </div>
  );
};

export default MiniWin;
