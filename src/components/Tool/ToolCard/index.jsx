/**
 * @file ToolCard.jsx
 * @description 各AIツールの情報を表示するカードコンポーネント。
 * @version 1.0.0
 * @create 2026/04/14
 * @usage <ToolCard tool={toolData} />
 */

import React from 'react';

import MiniWin from '@/components/MiniWin'
import Item from './Item'

import Dialog from '@/components/Dialog'
import {isReady} from '@/store/settingStore'
import {openById} from '@/store/modalButton'

/**
 * @param {Object} props
 * @param {Object} props.tool - ツールの情報オブジェクト
 * @param {string} props.tool.name - ツール名
 * @param {string} props.tool.description - ツールの説明
 * @param {string} props.tool.image - 画像URL
 */
const ToolCard = ({ tool }) => {
  const [isOpen, setIsOpen]=React.useState(false)
  return <>
    <Item
      image={tool.image}
      title={tool.name}
      description={tool.description}
      onClick={()=>{
        if(!isReady()) {
          Dialog.toast({message: 'please select models before using..'})
          openById('setting-panel')
          return
        }
        setIsOpen(true)
      }}
    />
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
