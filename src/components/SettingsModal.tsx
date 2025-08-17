import React, { useState, useRef, useEffect } from 'react';

function SettingsModal({ settings, onChange }: { settings: any, onChange: (s: any) => void }) {
  const [open, setOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  // 安全地处理settings，确保不是null或undefined
  const safeSettings = settings || {};

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

  // 添加调试信息
  console.log('SettingsModal render:', { open, settings: safeSettings });

  return (
    <>
      {/* 齿轮按钮固定右上角 */}
      <button
        className="fixed top-6 right-6 z-50 bg-white rounded-full shadow-lg p-3 hover:bg-gray-100 transition"
        onClick={() => {
          console.log('Settings button clicked');
          setOpen(true);
        }}
        title="设置"
      >
        <span className="text-2xl">⚙️</span>
      </button>
      
      {/* 弹窗 */}
      {open && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30"
          ref={modalRef} 
          onClick={handleMaskClick}
        >
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md relative">
            <span 
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 cursor-pointer text-xl"
              onClick={() => setOpen(false)} 
              title="关闭"
            >
              ×
            </span>
            <h2 className="text-xl font-bold mb-4 text-center">设置</h2>
            <div className="text-center p-4">
              <p>这是一个测试弹窗</p>
              <p>如果你能看到这个，说明弹窗功能正常</p>
              <button 
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
                onClick={() => setOpen(false)}
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default SettingsModal; 