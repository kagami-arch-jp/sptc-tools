/**
 * @jsDoc
 * ListItem コンポーネント
 *
 * 機能:
 * - タイトルの表示とクリックによるコンテンツの展開/折りたたみ。
 * - ホバー時の視覚的フィードバックの提供。
 *
 * 作成日: 2026/04/13
 */
import React, { useState } from 'react';
import './index.scss';

const ListItem = ({ title, content, className }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className={`list-item-wrapper ${isExpanded ? 'expanded' : ''}`}>
      <div className="list-item-header" onClick={toggleExpand}>
        <span className="title-text">{title}</span>
        <span className={`arrow-icon ${isExpanded ? 'rotated' : ''}`}>
          ▾
        </span>
      </div>
      <div className="list-item-content">
        <div className={"content-inner "+className}>
          {content}
        </div>
      </div>
    </div>
  );
};

export default ListItem;
