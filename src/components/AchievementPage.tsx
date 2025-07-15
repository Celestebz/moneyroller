import React, { useMemo } from 'react';

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

function getDaySalary(settings: Settings) {
  const workHours = getWorkHours(settings.workStart, settings.workEnd);
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
    const workSeconds = (end.getTime() - start.getTime()) / 1000;
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
    <div className="bg-white rounded shadow p-4 max-w-md mx-auto mt-8 text-center">
      <h2 className="text-xl font-bold mb-4">数据与成就</h2>
      <div className="mb-2 text-lg">今日累计收入：<span className="font-mono text-green-600">￥{todayEarned.toFixed(2)}</span></div>
      <div className="mb-2 text-lg">本周累计收入：<span className="font-mono text-blue-600">￥{weekEarned.toFixed(2)}</span></div>
      <div className="mb-2 text-lg">本月累计收入：<span className="font-mono text-purple-600">￥{monthEarned.toFixed(2)}</span></div>
    </div>
  );
};

export default AchievementPage; 