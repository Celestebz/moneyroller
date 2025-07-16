import React, { useState } from 'react';
import SettingsModal from './components/SettingsModal';
import MoneyTicker from './components/MoneyTicker';
import SoundToggle from './components/SoundToggle';
import EggZone from './components/EggZone';
import AchievementPage from './components/AchievementPage';

function App() {
  const [settings, setSettings] = useState<any>(() => {
    const saved = localStorage.getItem('salarySettings');
    return saved ? JSON.parse(saved) : null;
  });
  const [soundType, setSoundType] = useState<string>(() => localStorage.getItem('soundType') || 'coin');

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-yellow-50 via-yellow-100 to-yellow-200 flex flex-col items-center relative">
      <SettingsModal settings={settings} onChange={setSettings} />
      <div className="flex items-center gap-3 mt-12 mb-2">
        <img src="/gold-coin.png" className="w-12 h-12 drop-shadow-lg" alt="logo" />
        <h1 className="text-5xl font-extrabold text-yellow-500 tracking-wide drop-shadow">薪跳</h1>
      </div>
      <p className="text-lg text-yellow-700 mb-6">上班时间自动“可视化赚钱”的网页工具</p>
      <SoundToggle onChange={setSoundType} />
      {settings && <MoneyTicker settings={settings} soundType={soundType} />}
      <EggZone />
      {settings && <AchievementPage settings={settings} />}
    </div>
  );
}

export default App; 