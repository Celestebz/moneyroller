import React, { useMemo } from 'react';

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

function getDaySalary(settings: Settings) {
  const workHours = settings.workDuration !== '' && settings.workDuration !== undefined && !isNaN(Number(settings.workDuration))
    ? Number(settings.workDuration)
    : getWorkHours(settings.workStart, settings.workEnd);
  if (settings.salaryType === 'month') {
    return settings.salary / 21.75;
  } else if (settings.salaryType === 'hour') {
    return settings.salary * workHours;
  }
  return settings.salary;
}

function getWorkdaysInRange(settings: Settings, start: Date, end: Date) {
  let count = 0;
  const cur = new Date(start);
  while (cur <= end) {
    const day = cur.getDay() === 0 ? 7 : cur.getDay();
    if (settings.workDays.includes(day)) count++;
    cur.setDate(cur.getDate() + 1);
  }
  return count;
}

const AchievementPage = ({ settings }: { settings: Settings }) => {
  const today = new Date();
  const daySalary = getDaySalary(settings);

  // 今日累计收入
  const todayEarned = useMemo(() => {
    const [sh, sm] = settings.workStart.split(':').map(Number);
    const [eh, em] = settings.workEnd.split(':').map(Number);
    const start = new Date(today.getFullYear(), today.getMonth(), today.getDate(), sh, sm, 0);
    const end = new Date(today.getFullYear(), today.getMonth(), today.getDate(), eh, em, 0);
    const now = today;
    if (now < start) return 0;
    if (now > end) return daySalary;
    const workHours = settings.workDuration !== '' && settings.workDuration !== undefined && !isNaN(Number(settings.workDuration))
      ? Number(settings.workDuration)
      : getWorkHours(settings.workStart, settings.workEnd);
    const workSeconds = workHours * 3600;
    const passedSeconds = (now.getTime() - start.getTime()) / 1000;
    return (daySalary * passedSeconds) / workSeconds;
  }, [settings, daySalary, today]);

  // 本周累计收入
  const weekEarned = useMemo(() => {
    const firstDay = new Date(today);
    firstDay.setDate(today.getDate() - today.getDay() + 1); // 周一
    const days = getWorkdaysInRange(settings, firstDay, today);
    return daySalary * days;
  }, [settings, daySalary, today]);

  // 本月累计收入
  const monthEarned = useMemo(() => {
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    const days = getWorkdaysInRange(settings, firstDay, today);
    return daySalary * days;
  }, [settings, daySalary, today]);

  return (
    <div className="bg-white/95 rounded-2xl shadow-xl p-6 my-6 max-w-md w-full border-2 border-yellow-200">
      <h2 className="text-2xl font-extrabold text-yellow-600 mb-4">数据与成就</h2>
      <div className="flex flex-col gap-2">
        <div className="flex justify-between text-lg">
          <span>今日累计收入：</span>
          <span className="font-mono text-yellow-600 font-bold">￥{todayEarned.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-lg">
          <span>本周累计收入：</span>
          <span className="font-mono text-yellow-500 font-bold">￥{weekEarned.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-lg">
          <span>本月累计收入：</span>
          <span className="font-mono text-yellow-400 font-bold">￥{monthEarned.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

export default AchievementPage; 