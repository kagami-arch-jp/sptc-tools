/**
 * @description モデル選択用のドロップダウンコンポーネント（ロード・エラー・更新機能付き）
 * @created 2026-04-14
 * @usage <ModelSelect label="テキストモデル" apiFunc={fetchTextModels} value={val} onChange={setVal} />
 */
import React, { useState, useEffect } from 'react';
import './index.scss';

function ModelSelect({ label, value, onChange, selectOptions=[] }) {

  return (
    <div className="model-select-container">
      <div className="label-row">
        <label>{label}</label>
      </div>

      <div className="select-wrapper">
        <select
          key={selectOptions.join('-')}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={!selectOptions.length}
        >
        {(()=>{
          const options=[]
          if(selectOptions.length===0) {
            options.push(<option value="">モデルが見つかりません</option>)
          }else{
            selectOptions.map(m =>{
              options.push(<option key={m.name} value={m.name}>{m.name}</option>)
            })
          }
          return options
        })()}
        </select>
      </div>
    </div>
  );
}

export default ModelSelect;
