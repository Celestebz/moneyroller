import React, { useEffect, useState, useRef } from 'react';

interface Settings {
  salaryType: 'month' | 'day' | 'hour';
  salary: number;
  workStart: string;
  workEnd: string;
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
  const workSeconds = (end.getTime() - start.getTime()) / 1000;
  const passedSeconds = (now.getTime() - start.getTime()) / 1000;
  const workHours = getWorkHours(settings.workStart, settings.workEnd);
  let daySalary = settings.salary;
  if (settings.salaryType === 'month') {
    daySalary = settings.salary / 21.75;
  } else if (settings.salaryType === 'hour') {
    daySalary = settings.salary * workHours;
  }
  return (daySalary * passedSeconds) / workSeconds;
}

function getTotalEarned(settings: Settings) {
  const workHours = getWorkHours(settings.workStart, settings.workEnd);
  let daySalary = settings.salary;
  if (settings.salaryType === 'month') {
    daySalary = settings.salary / 21.75;
  } else if (settings.salaryType === 'hour') {
    daySalary = settings.salary * workHours;
  }
  return daySalary;
}

// 声效资源路径
const soundMap: Record<string, string> = {
  coin: '/src/assets/sounds/coin.mp3',
  click: '/src/assets/sounds/click.mp3',
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
      if (soundType !== 'mute' && Math.floor(val * 100) !== Math.floor(prev.current * 100)) {
        // 金额有跳动才播放
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
    <div className="flex flex-col items-center my-8">
      <div className="text-2xl text-gray-500 mb-2">今日已赚</div>
      <div className="text-5xl font-mono font-bold text-green-600 transition-all duration-500">
        ￥{earned.toFixed(2)}
      </div>
      {/* 声效播放器，隐藏 */}
      {soundType !== 'mute' && (
        <audio ref={audioRef} src={soundMap[soundType]} preload="auto" style={{ display: 'none' }} />
      )}
    </div>
  );
};

export default MoneyTicker; 