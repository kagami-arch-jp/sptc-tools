import React from 'react';
import './index.scss';

/**
 * @component Item
 * @description マウスホバー時に180度回転し、表面（画像とタイトル）から裏面（説明文）へと切り替わるアニメーション付きの円形コンポーネント。
 * @version 1.0.0
 * @createDate 2026-04-15
 * @usage
 * <Item
 *   image="https://example.com/image.png"
 *   title="タイトル"
 *   description="ここに詳細な説明文が入ります。"
 * />
 *
 * @completed
 * - [x] 3D回転アニメーションの実装
 * - [x] 裏面テキストのスライドインエフェクト
 * - [x] ダークモード対応
 * - [x] テキスト溢れ防止（省略表示）
 * - [x] 画像欠損時のフォールバック表示
 */

/**
 * @param {Object} props
 * @param {string} [props.image] - 表示する背景画像のURL
 * @param {string} [props.title] - 表面に表示するタイトル
 * @param {string} [props.description] - 裏面に表示する説明文
 */
const Item = ({ image, title, description, onClick }) => {
  return (
    <div className="item-container" onClick={onClick}>
      <div className="item-card">
        {/* 表面 (Front) */}
        <div className="item-face item-front">
          {image && (
            <div
              className="item-image"
              style={{ backgroundImage: `url(${image})` }}
              role="presentation"
            />
          )}
          <div className="item-title-wrapper">
            <span className="item-title">{title || 'No Title'}</span>
          </div>
        </div>

        {/* 裏面 (Back) */}
        <div className="item-face item-back">
          <div className="item-description-wrapper">
            <p className="item-description">
              {description || '説明がありません。'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Item;
