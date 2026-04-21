/**
 * @component ButtonDemo
 * @description Buttonコンポーネントのカタログ表示用コンポーネント
 * @author kagami-arch-j@bot
 * @created 2026-04-21
 */
import React, { useState } from 'react';
import Button from '@/components/Button';
import { useLoadingSimulation } from '@/hooks/useLoadingSimulation';
import './index.scss';

const ButtonDemo = () => {
  const [loadingId, setLoadingId] = useState(null);
  const [isLoading, startLoading] = useLoadingSimulation(2000);

  const handleButtonClick = (id) => {
    setLoadingId(id);
    startLoading();
  };

  const colors = ['primary', 'default', 'success', 'warning', 'danger'];
  const sizes = ['large', 'medium', 'small'];

  return (
    <div className="demo-section">
      <h2 className="demo-section__title">Button Catalog</h2>
      <div className="demo-section__card">
        <div className="demo-grid">
          {sizes.map(size => (
            <div key={size} className="demo-grid__group">
              <span className="demo-grid__label">{size}</span>
              <div className="demo-grid__buttons">
                {colors.map(color => (
                  <Button
                    key={color}
                    size={size}
                    color={color}
                    status={loadingId === color ? 'loading' : 'normal'}
                    disabled={loadingId === color}
                    onClick={() => handleButtonClick(color)}
                  >
                    {color}
                  </Button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ButtonDemo;