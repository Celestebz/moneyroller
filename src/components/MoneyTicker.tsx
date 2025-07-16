import React, { useEffect, useState, useRef } from 'react';

interface Settings {
  salaryType: 'month' | 'day' | 'hour';
  salary: number;
  workStart: string;
  workEnd: string;
  workDuration?: string;
  workDays: number[];
}

function getWorkHours(start: string, end: string) {
  const [sh, sm] = start.split(':').map(Number);
  const [eh, em] = end.split(':').map(Number);
  return (eh + em/60) - (sh + sm/60);
}

function getTodayIsWorkday(workDays: number[]) {
  const today = new Date().getDay(); // 0=Sun, 1=Mon
  return workDays.includes(today === 0 ? 7 : today);
}

function getTodayEarned(settings: Settings) {
  if (!getTodayIsWorkday(settings.workDays)) return 0;
  const now = new Date();
  const [sh, sm] = settings.workStart.split(':').map(Number);
  const [eh, em] = settings.workEnd.split(':').map(Number);
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), sh, sm, 0);
  const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), eh, em, 0);
  if (now < start) return 0;
  if (now > end) return getTotalEarned(settings);
  const workHours = settings.workDuration !== '' && settings.workDuration !== undefined && !isNaN(Number(settings.workDuration))
    ? Number(settings.workDuration)
    : getWorkHours(settings.workStart, settings.workEnd);
  const workSeconds = workHours * 3600;
  const passedSeconds = (now.getTime() - start.getTime()) / 1000;
  let daySalary = settings.salary;
  if (settings.salaryType === 'month') {
    daySalary = settings.salary / 21.75;
  } else if (settings.salaryType === 'hour') {
    daySalary = settings.salary * workHours;
  }
  return (daySalary * passedSeconds) / workSeconds;
}

function getTotalEarned(settings: Settings) {
  const workHours = settings.workDuration !== '' && settings.workDuration !== undefined && !isNaN(Number(settings.workDuration))
    ? Number(settings.workDuration)
    : getWorkHours(settings.workStart, settings.workEnd);
  let daySalary = settings.salary;
  if (settings.salaryType === 'month') {
    daySalary = settings.salary / 21.75;
  } else if (settings.salaryType === 'hour') {
    daySalary = settings.salary * workHours;
  }
  return daySalary;
}

// 只保留coin声效
const soundMap: Record<string, string> = {
  coin: '/src/assets/sounds/coin.mp3',
};

const MoneyTicker = ({ settings, soundType }: { settings: Settings; soundType: string }) => {
  const [earned, setEarned] = useState(0);
  const prev = useRef(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    function update() {
      const val = getTodayEarned(settings);
      setEarned(val);
      // 声效播放逻辑
      if (soundType === 'coin' && Math.floor(val * 100) !== Math.floor(prev.current * 100)) {
        if (audioRef.current) {
          audioRef.current.currentTime = 0;
          audioRef.current.play();
        }
      }
      prev.current = val;
    }
    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, [settings, soundType]);

  return (
    <div className="bg-white/90 rounded-2xl shadow-2xl px-10 py-8 flex flex-col items-center mb-6 border-4 border-yellow-200">
      <div className="text-xl text-yellow-600 mb-2">今日已赚</div>
      <div className="text-7xl font-extrabold font-mono bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 text-transparent bg-clip-text drop-shadow-lg transition-transform duration-300 ease-in-out transform hover:scale-105">
        ￥{earned.toFixed(2)}
      </div>
      {/* 声效播放器，隐藏 */}
      {soundType === 'coin' && (
        <audio ref={audioRef} src={soundMap['coin']} preload="auto" style={{ display: 'none' }} />
      )}
    </div>
  );
};

export default MoneyTicker; 