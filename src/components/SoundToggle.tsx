import React, { useEffect, useState } from 'react';

const SOUND_OPTIONS = [
  { label: '金币声', value: 'coin', icon: '🪙' },
  { label: '静音', value: 'mute', icon: '🔇' },
];

function SoundToggle({ onChange }: { onChange: (sound: string) => void }) {
  const [sound, setSound] = useState(() => localStorage.getItem('soundType') || 'coin');

  useEffect(() => {
    localStorage.setItem('soundType', sound);
    onChange(sound);
  }, [sound, onChange]);

  return (
    <div className="flex items-center gap-3 mb-6">
      <span className="text-gray-500 font-medium">声效：</span>
      {SOUND_OPTIONS.map(opt => (
        <button
          key={opt.value}
          className={`flex items-center gap-1 px-5 py-2 rounded-full font-bold shadow transition-all duration-200
            ${sound === opt.value
              ? 'bg-gradient-to-r from-yellow-400 to-yellow-300 text-white shadow-lg scale-105'
              : 'bg-yellow-100 text-yellow-700'}
            hover:scale-105`}
          onClick={() => setSound(opt.value)}
        >
          <span className="text-xl">{opt.icon}</span> {opt.label}
        </button>
      ))}
    </div>
  );
}

export default SoundToggle; 