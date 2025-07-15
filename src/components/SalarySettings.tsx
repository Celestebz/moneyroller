import React, { useState, useEffect } from 'react';

const defaultSettings = {
  salaryType: 'month', // 'month' | 'day' | 'hour'
  salary: 10000,
  workStart: '09:00',
  workEnd: '18:00',
  workDays: [1,2,3,4,5], // 1=Mon, 7=Sun
};

function getWorkHours(start: string, end: string) {
  const [sh, sm] = start.split(':').map(Number);
  const [eh, em] = end.split(':').map(Number);
  return (eh + em/60) - (sh + sm/60);
}

function SalarySettings({ onChange, initial }: { onChange: (settings: any) => void, initial?: any }) {
  const [settings, setSettings] = useState(() => {
    if (initial) return initial;
    const saved = localStorage.getItem('salarySettings');
    return saved ? JSON.parse(saved) : defaultSettings;
  });

  useEffect(() => {
    localStorage.setItem('salarySettings', JSON.stringify(settings));
    onChange(settings);
  }, [settings, onChange]);

  // 工资换算
  const workHours = getWorkHours(settings.workStart, settings.workEnd);
  const workDaysPerMonth = 21.75; // 平均每月工作日
  let monthSalary = settings.salary;
  let daySalary = settings.salary;
  let hourSalary = settings.salary;
  if (settings.salaryType === 'month') {
    monthSalary = settings.salary;
    daySalary = monthSalary / workDaysPerMonth;
    hourSalary = daySalary / workHours;
  } else if (settings.salaryType === 'day') {
    daySalary = settings.salary;
    monthSalary = daySalary * workDaysPerMonth;
    hourSalary = daySalary / workHours;
  } else {
    hourSalary = settings.salary;
    daySalary = hourSalary * workHours;
    monthSalary = daySalary * workDaysPerMonth;
  }

  return (
    <div className="bg-white rounded shadow p-4 max-w-md mx-auto mt-2">
      <h2 className="text-xl font-bold mb-4">工资与时间设置</h2>
      <div className="mb-3 flex gap-2">
        <label>
          <input type="radio" name="salaryType" value="month" checked={settings.salaryType==='month'}
            onChange={() => setSettings(s => ({...s, salaryType: 'month'}))} /> 月薪
        </label>
        <label>
          <input type="radio" name="salaryType" value="day" checked={settings.salaryType==='day'}
            onChange={() => setSettings(s => ({...s, salaryType: 'day'}))} /> 日薪
        </label>
        <label>
          <input type="radio" name="salaryType" value="hour" checked={settings.salaryType==='hour'}
            onChange={() => setSettings(s => ({...s, salaryType: 'hour'}))} /> 时薪
        </label>
      </div>
      <input
        className="border rounded px-2 py-1 w-full mb-3"
        type="number"
        min={0}
        value={settings.salary}
        onChange={e => setSettings(s => ({...s, salary: Number(e.target.value)}))}
        placeholder="请输入工资"
      />
      <div className="mb-3 flex gap-2">
        <div>
          <label className="block text-sm">上班时间</label>
          <input type="time" value={settings.workStart}
            onChange={e => setSettings(s => ({...s, workStart: e.target.value}))}
            className="border rounded px-2 py-1" />
        </div>
        <div>
          <label className="block text-sm">下班时间</label>
          <input type="time" value={settings.workEnd}
            onChange={e => setSettings(s => ({...s, workEnd: e.target.value}))}
            className="border rounded px-2 py-1" />
        </div>
      </div>
      <div className="mb-3">
        <label className="block text-sm mb-1">工作日</label>
        <div className="flex gap-1">
          {[1,2,3,4,5,6,7].map(d => (
            <label key={d} className={`px-2 py-1 rounded cursor-pointer ${settings.workDays.includes(d) ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
              <input type="checkbox" className="hidden" checked={settings.workDays.includes(d)}
                onChange={() => setSettings(s => ({...s, workDays: s.workDays.includes(d) ? s.workDays.filter(x=>x!==d) : [...s.workDays, d]}))} />
              {['一','二','三','四','五','六','日'][d-1]}
            </label>
          ))}
        </div>
      </div>
      <div className="text-sm text-gray-500 mt-2">
        月薪：￥{monthSalary.toFixed(2)} | 日薪：￥{daySalary.toFixed(2)} | 时薪：￥{hourSalary.toFixed(2)}
      </div>
    </div>
  );
}

export default SalarySettings; 