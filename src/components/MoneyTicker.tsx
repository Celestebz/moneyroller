import React, { useEffect, useState, useRef } from 'react';

interface Settings {
  salaryType: 'month' | 'day' | 'hour';
  salary: number;
  amStart: string;
  amEnd: string;
  pmStart: string;
  pmEnd: string;
  workDays: number[];
}

function getTimeDiff(start: string, end: string) {
  if (!start || !end) return 0;
  const [sh, sm] = start.split(':').map(Number);
  const [eh, em] = end.split(':').map(Number);
  return (eh + em/60) - (sh + sm/60);
}

function getWorkHours(settings: Settings) {
  return getTimeDiff(settings.amStart, settings.amEnd) + getTimeDiff(settings.pmStart, settings.pmEnd);
}

function getTodayIsWorkday(workDays: number[]) {
  const today = new Date().getDay(); // 0=Sun, 1=Mon
  return workDays.includes(today === 0 ? 7 : today);
}

function getTodayEarned(settings: Settings) {
  if (!getTodayIsWorkday(settings.workDays)) return 0;
  const now = new Date();
  
  // 计算上午和下午的工作时间
  const amStart = settings.amStart ? new Date(now.getFullYear(), now.getMonth(), now.getDate(), ...settings.amStart.split(':').map(Number), 0) : null;
  const amEnd = settings.amEnd ? new Date(now.getFullYear(), now.getMonth(), now.getDate(), ...settings.amEnd.split(':').map(Number), 0) : null;
  const pmStart = settings.pmStart ? new Date(now.getFullYear(), now.getMonth(), now.getDate(), ...settings.pmStart.split(':').map(Number), 0) : null;
  const pmEnd = settings.pmEnd ? new Date(now.getFullYear(), now.getMonth(), now.getDate(), ...settings.pmEnd.split(':').map(Number), 0) : null;
  
  // 如果没有设置时间，返回0
  if (!amStart || !amEnd || !pmStart || !pmEnd) return 0;
  
  const workHours = getWorkHours(settings);
  if (workHours === 0) return 0;
  
  let daySalary = settings.salary;
  if (settings.salaryType === 'month') {
    daySalary = settings.salary / 21.75;
  } else if (settings.salaryType === 'hour') {
    daySalary = settings.salary * workHours;
  }
  
  // 计算当前时间在工作时间内的进度
  let earned = 0;
  
  // 上午部分
  if (now >= amStart && now <= amEnd) {
    const amWorkSeconds = (amEnd.getTime() - amStart.getTime()) / 1000;
    const amPassedSeconds = (now.getTime() - amStart.getTime()) / 1000;
    earned += (daySalary * (amPassedSeconds / amWorkSeconds)) / 2;
  } else if (now > amEnd) {
    earned += daySalary / 2;
  }
  
  // 下午部分
  if (now >= pmStart && now <= pmEnd) {
    const pmWorkSeconds = (pmEnd.getTime() - pmStart.getTime()) / 1000;
    const pmPassedSeconds = (now.getTime() - pmStart.getTime()) / 1000;
    earned += (daySalary * (pmPassedSeconds / pmWorkSeconds)) / 2;
  } else if (now > pmEnd) {
    earned += daySalary / 2;
  }
  
  return earned;
}

function getTotalEarned(settings: Settings) {
  const workHours = getWorkHours(settings);
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
  coin: '/coin.mp3',
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
          try {
            audioRef.current.currentTime = 0;
            audioRef.current.play().catch(err => console.log('声效播放失败:', err));
          } catch (err) {
            console.log('声效播放错误:', err);
          }
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