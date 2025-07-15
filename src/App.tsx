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
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 relative">
      <SettingsModal settings={settings} onChange={setSettings} />
      <h1 className="text-4xl font-bold mb-4 mt-8">薪跳</h1>
      <p className="text-lg text-gray-600 mb-6">上班时间自动“可视化赚钱”的网页工具</p>
      <SoundToggle onChange={setSoundType} />
      {settings && <MoneyTicker settings={settings} soundType={soundType} />}
      <EggZone />
      {settings && <AchievementPage settings={settings} />}
    </div>
  );
}

export default App; 