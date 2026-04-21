/**
 * @component Demo
 * @description コンポーネントカタログのメインページ
 * @description 機能一覧:
 * - Buttonコンポーネントのカタログ表示
 * - MultiLineInputコンポーネ &#components/MultiLineInputのカタログ表示
 * @author kagami-arch-j@bot
 * @created 2026-04-21
 */
import React from 'react';
import ButtonDemo from './ButtonDemo';
import InputDemo from './InputDemo';
import './index.scss';

const Demo = () => {
  return (
    <div className="demo-page">
      <header className="demo-page__header">
        <h1>Component Catalog</h1>
        <p>UI Components Showcase</p>
      </header>
      <main className="demo-page__content">
        <ButtonDemo />
        <InputDemo />
      </main>
    </div>
  );
};

export default Demo;