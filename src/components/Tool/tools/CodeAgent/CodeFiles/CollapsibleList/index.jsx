/**
 * @jsDoc
 * CollapsibleList コンポーネント
 *
 * 機能:
 * - 外部から渡されたタイトルと内容のリストを表示する。
 * - 各項目は個別に折りたたみ・展開が可能。
 * - ダークモードに対応。
 *
 * 作成日: 2026/04/13
 * 呼び出し方: <CollapsibleList data={[{title: 'タイトル1', content: '内容1'}, ...]} />
 */
import React from 'react';
import { darkMode } from '@/store/darkMode';
import ListItem from './ListItem';
import './index.scss';

const CollapsibleList = ({ data = [], contentClassName, }) => {
  const isDarkMode = darkMode.useValue();

  return (
    <div className={`collapsible-list-container ${isDarkMode ? 'dark-mode' : ''}`}>
      {data.map((item, index) => (
        <ListItem
          key={index}
          className={contentClassName || ''}
          title={item.title}
          content={item.content}
        />
      ))}
    </div>
  );
};

export default CollapsibleList;
