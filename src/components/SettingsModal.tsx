import React, { useState, useRef, useEffect } from 'react';
import SalarySettings from './SalarySettings';

const modalRootStyle = 'fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30';
const modalCardStyle = 'bg-white rounded-xl shadow-xl p-6 w-full max-w-md relative';
const closeBtnStyle = 'absolute right-4 top-4 text-gray-400 hover:text-gray-600 cursor-pointer text-xl';

function SettingsModal({ settings, onChange }: { settings: any, onChange: (s: any) => void }) {
  const [open, setOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  // 关闭弹窗：点击遮罩或ESC
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  function handleMaskClick(e: React.MouseEvent) {
    if (e.target === modalRef.current) setOpen(false);
  }

  return (
    <>
      {/* 齿轮按钮固定右上角 */}
      <button
        className="fixed top-6 right-6 z-50 bg-white rounded-full shadow-lg p-3 hover:bg-gray-100 transition"
        onClick={() => setOpen(true)}
        title="设置"
      >
        <span className="text-2xl">⚙️</span>
      </button>
      {/* 弹窗 */}
      {open && (
        <div className={modalRootStyle} ref={modalRef} onClick={handleMaskClick}>
          <div className={modalCardStyle}>
            <span className={closeBtnStyle} onClick={() => setOpen(false)} title="关闭">×</span>
            <SalarySettings onChange={onChange} initial={settings} />
          </div>
        </div>
      )}
    </>
  );
}

export default SettingsModal; 