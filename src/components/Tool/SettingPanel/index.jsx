/**
 * @description 設定管理パネル。APIキー、モデル選択、パラメータ、テーマ設定を管理。
 * @created 2026-04-14
 * @usage <SettingPanel />
 */
import React from 'react';
import './index.scss';
import ModelSelect from './ModelSelect';
import FontSizeSelect from './FontSizeSelect';
import settingStore from '@/store/settingStore';
import { darkMode } from '@/store/darkMode';
import { fetchModels } from '@/api/settings';

function SettingPanel() {
  const [settings, setSettings] = settingStore.use();
  const isDarkMode = darkMode.useValue();
  const updateSetting = (key, value) => {
    setSettings({ ...settings, [key]: value });
  };

  React.useEffect(()=>{
    const key=settings.onlineMode? 'onlineModels': 'localModels'
    fetchModels().then(models=>updateSetting(key, models))
  }, [settings.onlineMode])

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
            selectOptions={settings.onlineMode? settings.onlineModels: settings.localModels}
            value={settings.onlineMode? settings.textModelOnline: settings.textModelLocal}
            onChange={(val) => updateSetting(settings.onlineMode? 'textModelOnline': 'textModelLocal', val)}
          />
          <ModelSelect
            label="画像生成モデル"
            selectOptions={settings.onlineMode? settings.onlineModels: settings.localModels}
            value={settings.onlineMode? settings.imageModelOnline: settings.imageModelLocal}
            onChange={(val) => updateSetting(settings.onlineMode? 'imageModelOnline': 'imageModelLocal', val)}
          />
        </section>

<section className="setting-group">
          <FontSizeSelect />
        </section>

        <section className="setting-group">
          <ModelSelect
            label="表示言語"
            selectOptions={[{name: '中文'}, {name: 'English'}, {name: '日本語'}]}
            value={settings.language}
            onChange={(val) => updateSetting('language', val)}
          />
          <ModelSelect
            label="応答トーン"
            selectOptions={[{name: 'human'}, {name: 'assistant'}]}
            value={settings.tone}
            onChange={(val) => updateSetting('tone', val)}
          />
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
