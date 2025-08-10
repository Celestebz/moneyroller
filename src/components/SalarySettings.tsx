import React, { useState, useEffect, useRef } from 'react';

const defaultSettings = {
  salaryType: 'month', // 'month' | 'day' | 'hour'
  salary: 10000,
  amStart: '', // 上午上班
  amEnd: '',   // 上午下班
  pmStart: '', // 下午上班
  pmEnd: '',   // 下午下班
  workDays: [1,2,3,4,5], // 1=Mon, 7=Sun
};

function getTimeDiff(start: string, end: string) {
  if (!start || !end) return 0;
  const [sh, sm] = start.split(':').map(Number);
  const [eh, em] = end.split(':').map(Number);
  return (eh + em/60) - (sh + sm/60);
}

        // 自定义24小时制时间选择器组件
        function TimeInput({ value, onChange, placeholder }: { value: string, onChange: (time: string) => void, placeholder: string }) {
          const [isOpen, setIsOpen] = useState(false);
          const [tempValue, setTempValue] = useState(value);
          const [selectedHour, setSelectedHour] = useState<string>('');
          const [selectedMinute, setSelectedMinute] = useState<string>('');
          const [forceUpdate, setForceUpdate] = useState(0); // 强制重新渲染
          const dropdownRef = useRef<HTMLDivElement>(null);

          useEffect(() => {
            setTempValue(value);
            if (value) {
              const [hour, minute] = value.split(':');
              setSelectedHour(hour);
              setSelectedMinute(minute);
            }
          }, [value]);

          useEffect(() => {
            function handleClickOutside(event: MouseEvent) {
              if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
              }
            }
            
            // 同时监听 mousedown 和 touchstart 事件，确保在移动端和生产环境都能工作
            document.addEventListener('mousedown', handleClickOutside);
            document.addEventListener('touchstart', handleClickOutside);
            
            return () => {
              document.removeEventListener('mousedown', handleClickOutside);
              document.removeEventListener('touchstart', handleClickOutside);
            };
          }, []);

          const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
          const minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));

          const handleHourSelect = (hour: string) => {
            console.log('Hour selected:', hour);
            setSelectedHour(hour);
            const newTime = `${hour}:${selectedMinute || '00'}`;
            setTempValue(newTime);
            onChange(newTime);
          };

          const handleMinuteSelect = (minute: string) => {
            console.log('Minute selected:', minute);
            setSelectedMinute(minute);
            const newTime = `${selectedHour || '00'}:${minute}`;
            setTempValue(newTime);
            onChange(newTime);
            setIsOpen(false);
          };

          const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const input = e.target.value;
            if (/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(input)) {
              onChange(input);
              const [hour, minute] = input.split(':');
              setSelectedHour(hour);
              setSelectedMinute(minute);
            }
            setTempValue(input);
          };

          return (
            <div className="relative" ref={dropdownRef}>
              <input
                type="text"
                value={tempValue}
                onChange={handleInputChange}
                onFocus={() => {
                  console.log('Input focused, opening dropdown'); // 调试信息
                  setIsOpen(true);
                }}
                placeholder={placeholder}
                className="border rounded px-2 py-1 w-full text-center font-mono"
                pattern="[0-9]{2}:[0-9]{2}"
              />
              {isOpen && (
                <div 
                  className="fixed bg-white border border-gray-300 rounded-lg shadow-2xl z-[99999] w-64"
                  style={{ 
                    position: 'fixed', 
                    zIndex: 99999,
                    top: dropdownRef.current ? dropdownRef.current.getBoundingClientRect().bottom + 5 : 0,
                    left: dropdownRef.current ? dropdownRef.current.getBoundingClientRect().left : 0
                  }}
                >
                  <div className="flex justify-between p-4">
                    {/* 小时选择 */}
                    <div className="text-center flex-1">
                      <div className="relative">
                        <div className="h-32 overflow-y-auto">
                          <div className="space-y-1">
                            {hours.map(hour => (
                              <button
                                key={hour}
                                type="button"
                                className={`h-8 w-full flex items-center justify-center text-gray-800 text-lg font-mono cursor-pointer rounded transition-all ${
                                  selectedHour === hour 
                                    ? 'bg-blue-500 text-white font-bold' 
                                    : 'hover:bg-gray-100'
                                }`}
                                onClick={() => handleHourSelect(hour)}
                              >
                                {hour}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* 分隔线 */}
                    <div className="w-px bg-gray-300 mx-2"></div>
                    
                    {/* 分钟选择 */}
                    <div className="text-center flex-1">
                      <div className="relative">
                        <div className="h-32 overflow-y-auto">
                          <div className="space-y-1">
                            {minutes.map(minute => (
                              <button
                                key={minute}
                                type="button"
                                className={`h-8 w-full flex items-center justify-center text-gray-800 text-lg font-mono cursor-pointer rounded transition-all ${
                                  selectedMinute === minute 
                                    ? 'bg-blue-500 text-white font-bold' 
                                    : 'hover:bg-gray-100'
                                }`}
                                onClick={() => handleMinuteSelect(minute)}
                              >
                                {minute}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* 确认按钮 */}
                  <div className="border-t border-gray-300 p-3">
                    <button
                      onClick={() => setIsOpen(false)}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition-colors"
                    >
                      确认
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        }

        function getWorkHours(settings: any) {
          // 只用上午/下午分段
          return getTimeDiff(settings.amStart, settings.amEnd) + getTimeDiff(settings.pmStart, settings.pmEnd);
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
  const workHours = getWorkHours(settings);
  const workDaysPerMonth = 21.75; // 平均每月工作日
  let monthSalary = settings.salary;
  let daySalary = settings.salary;
  let hourSalary = settings.salary;
  if (settings.salaryType === 'month') {
    monthSalary = settings.salary;
    daySalary = monthSalary / workDaysPerMonth;
    hourSalary = daySalary / (workHours || 1);
  } else if (settings.salaryType === 'day') {
    daySalary = settings.salary;
    monthSalary = daySalary * workDaysPerMonth;
    hourSalary = daySalary / (workHours || 1);
  } else {
    hourSalary = settings.salary;
    daySalary = hourSalary * (workHours || 1);
    monthSalary = daySalary * workDaysPerMonth;
  }

  return (
    <div className="bg-white rounded shadow p-4 max-w-md mx-auto mt-2">

      <h2 className="text-xl font-bold mb-4">工资与时间设置</h2>
      <div className="mb-3 flex gap-2">
        <label>
          <input type="radio" name="salaryType" value="month" checked={settings.salaryType==='month'}
            onChange={() => setSettings((s: any) => ({...s, salaryType: 'month'}))} /> 月薪
        </label>
        <label>
          <input type="radio" name="salaryType" value="day" checked={settings.salaryType==='day'}
            onChange={() => setSettings((s: any) => ({...s, salaryType: 'day'}))} /> 日薪
        </label>
        <label>
          <input type="radio" name="salaryType" value="hour" checked={settings.salaryType==='hour'}
            onChange={() => setSettings((s: any) => ({...s, salaryType: 'hour'}))} /> 时薪
        </label>
      </div>
      <input
        className="border rounded px-2 py-1 w-full mb-3"
        type="number"
        min={0}
        value={settings.salary}
        onChange={e => setSettings((s: any) => ({...s, salary: Number(e.target.value)}))}
        placeholder="请输入工资"
      />
      <div className="mb-3 flex flex-wrap gap-2">
        <div className="flex-1 min-w-[120px]">
          <label className="block text-sm">上午上班</label>
          <TimeInput
            value={settings.amStart}
            onChange={(time) => setSettings((s: any) => ({...s, amStart: time}))}
            placeholder="09:00"
          />
        </div>
        <div className="flex-1 min-w-[120px]">
          <label className="block text-sm">上午下班</label>
          <TimeInput
            value={settings.amEnd}
            onChange={(time) => setSettings((s: any) => ({...s, amEnd: time}))}
            placeholder="12:00"
          />
        </div>
        <div className="flex-1 min-w-[120px]">
          <label className="block text-sm">下午上班</label>
          <TimeInput
            value={settings.pmStart}
            onChange={(time) => setSettings((s: any) => ({...s, pmStart: time}))}
            placeholder="13:00"
          />
        </div>
        <div className="flex-1 min-w-[120px]">
          <label className="block text-sm">下午下班</label>
          <TimeInput
            value={settings.pmEnd}
            onChange={(time) => setSettings((s: any) => ({...s, pmEnd: time}))}
            placeholder="18:00"
          />
        </div>
      </div>
      <div className="mb-3">
        <label className="block text-sm mb-1">工作日</label>
        <div className="flex gap-1">
          {[1,2,3,4,5,6,7].map(d => (
            <label key={d} className={`px-2 py-1 rounded cursor-pointer ${settings.workDays.includes(d) ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
              <input type="checkbox" className="hidden" checked={settings.workDays.includes(d)}
                onChange={() => setSettings((s: any) => ({...s, workDays: s.workDays.includes(d) ? s.workDays.filter((x: any)=>x!==d) : [...s.workDays, d]}))} />
              {['一','二','三','四','五','六','日'][d-1]}
            </label>
          ))}
        </div>
      </div>
      <div className="text-sm text-gray-500 mt-2">
        工作时长：{workHours ? workHours.toFixed(2) : '--'} 小时<br/>
        月薪：￥{monthSalary.toFixed(2)} | 日薪：￥{daySalary.toFixed(2)} | 时薪：￥{hourSalary.toFixed(2)}
      </div>
    </div>
  );
}

export default SalarySettings;
