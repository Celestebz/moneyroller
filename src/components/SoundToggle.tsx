import React, { useEffect, useState } from 'react';

const SOUND_OPTIONS = [
  { label: '金币声', value: 'coin' },
  { label: '咔哒声', value: 'click' },
  { label: '静音', value: 'mute' },
];

function SoundToggle({ onChange }: { onChange: (sound: string) => void }) {
  const [sound, setSound] = useState(() => localStorage.getItem('soundType') || 'coin');

  useEffect(() => {
    localStorage.setItem('soundType', sound);
    onChange(sound);
  }, [sound, onChange]);

  return (
    <div className="flex items-center gap-2 mt-4">
      <span className="text-sm text-gray-500">声效：</span>
      {SOUND_OPTIONS.map(opt => (
        <label key={opt.value} className={`px-2 py-1 rounded cursor-pointer ${sound===opt.value ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
          <input
            type="radio"
            name="soundType"
            value={opt.value}
            checked={sound === opt.value}
            onChange={() => setSound(opt.value)}
            className="hidden"
          />
          {opt.label}
        </label>
      ))}
    </div>
  );
}

export default SoundToggle; 