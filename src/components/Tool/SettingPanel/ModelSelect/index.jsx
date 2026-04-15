/**
 * @description モデル選択用のドロップダウンコンポーネント（ロード・エラー・更新機能付き）
 * @created 2026-04-14
 * @usage <ModelSelect label="テキストモデル" apiFunc={fetchTextModels} value={val} onChange={setVal} />
 */
import React, { useState, useEffect } from 'react';
import './index.scss';

function ModelSelect({ label, apiFunc, value, onChange }) {
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const loadModels = async () => {
    setLoading(true);
    setError(false);
    try {
      const data = await apiFunc();
      setModels(data || []);
    } catch (e) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadModels();
  }, []);

  return (
    <div className="model-select-container">
      <div className="label-row">
        <label>{label}</label>
        <button className="refresh-btn" onClick={loadModels} disabled={loading}>
          {loading ? '...' : '更新'}
        </button>
      </div>

      <div className="select-wrapper">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={loading}
        >
          {loading ? (
            <option>読み込み中...</option>
          ) : error ? (
            <option value="">エラーが発生しました</option>
          ) : models.length === 0 ? (
            <option value="">モデルが見つかりません</option>
          ) : (
            models.map(m => <option key={m.name} value={m.name}>{m.name}</option>)
          )}
        </select>
      </div>
    </div>
  );
}

export default ModelSelect;
