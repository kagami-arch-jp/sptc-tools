/**
 * @component SettingPanelCommon
 * @description 汎用設定パネルコンポーネント
 * @description propsで設定項目の定義を受け取り、動的にUI生成
 * @created 2026-04-26
 */
import React from 'react';
import './index.scss';
import { getCommonSettingStore, getCommonSettingValue } from '@/store/commonSettingStore';
import { globalSettingStore, getFontSizePx, LANGUAGE_OPTIONS, FONT_SIZE_OPTIONS } from '@/store/globalSettingStore';

function GlobalSettings() {
  const [settings, setSettings] = globalSettingStore.use();

  const updateValue = (key, value) => {
    setSettings({ ...settings, [key]: value });
  };

  return (
    <div className="global-settings">
      <div className="setting-group">
        <div className="input-row">
          <label>言語</label>
          <select
            value={settings.language}
            onChange={(e) => updateValue('language', e.target.value)}
          >
            {LANGUAGE_OPTIONS.map((opt) => (
              <option key={opt.name} value={opt.name}>
                {opt.value}
              </option>
            ))}
          </select>
        </div>
        <div className="input-row">
          <label>字号</label>
          <select
            value={settings.fontSize}
            onChange={(e) => updateValue('fontSize', e.target.value)}
          >
            {FONT_SIZE_OPTIONS.map((opt) => (
              <option key={opt.name} value={opt.name}>
                {opt.value}
              </option>
            ))}
          </select>
        </div>
        <div className="checkbox-row">
          <label>
            <input
              type="checkbox"
              checked={settings.darkMode}
              onChange={(e) => updateValue('darkMode', e.target.checked)}
            />
            ダークモード
          </label>
        </div>
      </div>
    </div>
  )
}

function SelectInput({ store, config, value, onChange }) {
  const {selection}=config
  const [options, setOptions]=React.useState([])
  const [settings, setSettings] = store.use();
  React.useEffect(()=>{
    let ignore=false
    if(typeof selection==='function') {
      (async ()=>{
        const optionsKey=config.key+'-options'
        const oldValue=settings[optionsKey]
        const newValue=await selection(settings, oldValue)
        if(!ignore && options!==newValue.data) {
          setSettings(prev=>({...prev, [optionsKey]: newValue}))
          setOptions(newValue.data)
        }
      })()
    }else if(Array.isArray(selection)) {
      setOptions(selection)
    }
    return ()=>{
      ignore=true
    }
  }, [settings])
  return (
    <div className="input-row">
      <label>{config.info}</label>
      <select value={value ?? ''} onChange={(e) => onChange(e.target.value)}>
        {options.map((opt) => (
          <option key={opt.name} value={opt.name}>
            {opt.value}
          </option>
        ))}
      </select>
    </div>
  );
}

function PasswordInput({ config, value, onChange }) {
  return (
    <div className="input-row">
      <label>{config.info}</label>
      <input
        type="password"
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder="****"
      />
    </div>
  );
}

function RangeInput({ config, value, onChange }) {
  const displayValue = config.show ? config.show(value) : value;
  return (
    <div className="slider-row">
      <div className="label-val">
        <label>{config.info}</label>
        <span>{displayValue}</span>
      </div>
      <input
        type="range"
        min={config.min}
        max={config.max}
        step={config.step}
        value={value ?? config.min}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

function CheckboxInput({ config, value, onChange }) {
  return (
    <div className="checkbox-row">
      <label>
        <input
          type="checkbox"
          checked={value ?? false}
          onChange={(e) => onChange(e.target.checked)}
        />
        {config.info}
      </label>
    </div>
  );
}

function SettingItem({ config, store, parentPath }) {
  const [settings, setSettings] = store.use();
  const key = config.key;
  const value = settings?.[key];

  const updateValue = (newValue) => {
    setSettings({ ...settings, [key]: newValue });
  };

  const renderInput = () => {
    switch (config.type) {
      case 'select':
        return (
          <SelectInput store={store} config={config} value={value} onChange={updateValue} />
        );
      case 'password':
        return (
          <PasswordInput config={config} value={value} onChange={updateValue} />
        );
      case 'range':
        return (
          <RangeInput config={config} value={value} onChange={updateValue} />
        );
      case 'checkbox':
        return (
          <CheckboxInput config={config} value={value} onChange={updateValue} />
        );
      default:
        return null;
    }
  };

  const shouldShowChildren = config.type !== 'checkbox' || value === true;

  if(config?.hide?.(settings)) return null

  return (
    <div className="setting-item">
      {renderInput()}
      {config.children && shouldShowChildren && (
        <div className="setting-children">
          {config.children.map((child) => (
            <SettingItem
              key={child.key}
              config={child}
              store={store}
              parentPath={key}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function SettingPanelCommon(props) {
  const { settingKey, config, title='設定' } = props;
  const store = getCommonSettingStore(settingKey);
  const globalSettings = globalSettingStore.useValue();
  const isDark = globalSettings?.darkMode;

  return (
    <div className={`setting-panel-common ${isDark ? 'dark-mode' : ''}`}>
      {title && <h2 className="panel-title">{title}</h2>}
      <GlobalSettings />
      <div className="panel-body">
        {config.map((item) => (
          <SettingItem key={item.key} config={item} store={store} parentPath="" />
        ))}
      </div>
    </div>
  );
}

export default SettingPanelCommon;
