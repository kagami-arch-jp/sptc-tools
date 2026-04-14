/**
 * @file ToolCard.jsx
 * @description 各AIツールの情報を表示するカードコンポーネント。
 * @version 1.0.0
 * @create 2026/04/14
 * @usage <ToolCard tool={toolData} />
 */

import React from 'react';
import './index.scss';

import MiniWin from '@/components/MiniWin'

/**
 * @param {Object} props
 * @param {Object} props.tool - ツールの情報オブジェクト
 * @param {string} props.tool.name - ツール名
 * @param {string} props.tool.description - ツールの説明
 * @param {string} props.tool.image - 画像URL
 * @param {string} props.tool.alt - 画像のaltテキスト（プロンプト）
 */
const ToolCard = ({ tool }) => {
  const [isOpen, setIsOpen]=React.useState(false)
  return <>
    <div className="tool-card" onClick={()=>{
      setIsOpen(true)
    }}>
      <div className="tool-card-image-container">
        <img
          src={tool.image}
          alt={tool.alt}
          className="tool-card-image"
        />
      </div>
      <div className="tool-card-info">
        <h3 className="tool-card-title">{tool.name}</h3>
        <p className="tool-card-description">{tool.description}</p>
      </div>
    </div>
    <MiniWin
      id={"win"+tool.id}
      title={tool.name}
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      initialPosition={{ x: 100, y: 100 }}
      initialSize={{ width: innerWidth*.6|0, height: innerHeight*.6|0 }}
      children={tool.Component}
    />
  </>
};

export default ToolCard;
