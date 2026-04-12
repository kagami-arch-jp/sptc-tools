/**
 * @description 設定管理パネル。APIキー、モデル選択、パラメータ、テーマ設定を管理。
 * @created 2026-04-14
 * @usage <SettingPanel />
 */
import React from 'react';
import './index.scss';
import ModelSelect from './ModelSelect';
import settingStore from '@/store/settingStore';
import { darkMode } from '@/store/darkMode';
import { fetchTextModels, fetchImageModels } from '@/api/settings';

function SettingPanel() {
  const [settings, setSettings] = settingStore.use();
  const isDarkMode = darkMode.useValue();
  const updateSetting = (key, value) => {
    setSettings({ ...settings, [key]: value });
  };

  return (
    <div className={`setting-panel ${isDarkMode ? 'dark-mode' : ''}`}>
      <header className="panel-header">
        <h1>設定</h1>
      </header>

      <div className="panel-body">
        <section className="setting-group">
          <div className="checkbox-row">
            <label>
              <input
                type="checkbox"
                checked={settings.onlineMode}
                onChange={(e) => updateSetting('onlineMode', e.target.checked)}
              />
              オンラインモードを有効にする
            </label>
          </div>

          <div className="input-row">
            <label>API Key</label>
            <input
              type="password"
              value={settings.apiKey}
              readOnly={!settings.onlineMode}
              onChange={(e) => updateSetting('apiKey', e.target.value)}
              placeholder="sk-..."
            />
          </div>
        </section>

        <section className="setting-group">
          <ModelSelect
            label="テキストモデル"
            apiFunc={fetchTextModels}
            value={settings.textModel}
            onChange={(val) => updateSetting('textModel', val)}
          />
          <ModelSelect
            label="画像生成モデル"
            apiFunc={fetchImageModels}
            value={settings.imageModel}
            onChange={(val) => updateSetting('imageModel', val)}
          />
        </section>

        <section className="setting-group">
          <div className="slider-row">
            <div className="label-val">
              <label>Temperature</label>
              <span>{settings.temperature}</span>
            </div>
            <input
              type="range" min="0" max="2" step="0.1"
              value={settings.temperature}
              onChange={(e) => updateSetting('temperature', parseFloat(e.target.value))}
            />
          </div>

          <div className="slider-row">
            <div className="label-val">
              <label>Context Length</label>
              <span>{settings.contextLength} k</span>
            </div>
            <input
              type="range" min="8" max="128" step="1"
              value={settings.contextLength}
              onChange={(e) => updateSetting('contextLength', parseInt(e.target.value))}
            />
          </div>
        </section>

        <section className="setting-group">
          <div className="checkbox-row">
            <label>
              <input
                type="checkbox"
                checked={isDarkMode}
                onChange={(e) => darkMode.setValue(e.target.checked)}
              />
              ダークモード
            </label>
          </div>
        </section>
      </div>
    </div>
  );
}

export default SettingPanel;
