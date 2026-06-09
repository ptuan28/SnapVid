import React, { useState } from 'react';
import { Settings, Info, Server, Sparkles, RefreshCw } from 'lucide-react';

export default function SettingsModal({ 
  isOpen, 
  onClose, 
  defaultQuality, 
  setDefaultQuality, 
  customApiEndpoint, 
  setCustomApiEndpoint 
}) {
  const [tempQuality, setTempQuality] = useState(defaultQuality);
  const [tempEndpoint, setTempEndpoint] = useState(customApiEndpoint);
  const [savedMessage, setSavedMessage] = useState('');

  if (!isOpen) return null;

  const handleSave = () => {
    setDefaultQuality(tempQuality);
    setCustomApiEndpoint(tempEndpoint);
    setSavedMessage('Đã lưu cấu hình thành công! ✨');
    setTimeout(() => {
      setSavedMessage('');
      onClose();
    }, 1200);
  };

  const handleReset = () => {
    setTempQuality('720');
    setTempEndpoint('');
    setSavedMessage('Đã khôi phục cài đặt gốc! 🌸');
    setTimeout(() => setSavedMessage(''), 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-sm">
      <div className="relative w-full max-w-md p-6 bg-white bubble-shadow-brown rounded-3xl animate-scale-up">
        
        {/* Tiêu đề */}
        <div className="flex items-center gap-2 mb-5 text-[#FF8E9E]">
          <Settings className="w-6 h-6 animate-spin-slow" />
          <h2 className="text-2xl font-heading text-[#4A3B32]">Cài Đặt SnapVid</h2>
        </div>

        {/* Nội dung cài đặt */}
        <div className="space-y-5">
          {/* Cài đặt chất lượng video mặc định */}
          <div className="space-y-2">
            <label className="block text-sm font-bold text-[#4A3B32] flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#FFE885] fill-[#FFE885] stroke-[#4A3B32] stroke-2" />
              Chất lượng YouTube mặc định:
            </label>
            <div className="grid grid-cols-4 gap-2">
              {['1080', '720', '480', '360'].map((q) => (
                <button
                  key={q}
                  onClick={() => setTempQuality(q)}
                  className={`py-2 text-xs md:text-sm font-bold rounded-xl border-2 border-[#4A3B32] bouncy-hover shadow-[2px_2px_0px_#4A3B32] ${
                    tempQuality === q
                      ? 'bg-[#FF8E9E] text-white'
                      : 'bg-white text-[#4A3B32] hover:bg-[#FFFBF0]'
                  }`}
                >
                  {q}p
                </button>
              ))}
            </div>
            <p className="text-[11px] text-[#8E7E73] font-semibold">
              * TikTok/Douyin sẽ luôn cố gắng tải chất lượng HD gốc của video.
            </p>
          </div>

          {/* Cài đặt Endpoint API tùy chỉnh */}
          <div className="space-y-2">
            <label className="block text-sm font-bold text-[#4A3B32] flex items-center gap-1.5">
              <Server className="w-4 h-4 text-[#A7E3FF]" />
              Máy chủ API tùy chỉnh (Cobalt):
            </label>
            <input
              type="url"
              value={tempEndpoint}
              onChange={(e) => setTempEndpoint(e.target.value)}
              placeholder="Ví dụ: https://my-cobalt-instance.com"
              className="w-full px-4 py-2.5 rounded-xl border-2 border-[#4A3B32] bg-[#FFFBF0] text-[#4A3B32] placeholder-[#A09085] focus:outline-none focus:ring-2 focus:ring-[#FF8E9E] font-semibold text-sm"
            />
            <div className="p-3 bg-[#FFF8E7] rounded-xl border-2 border-[#FDF3DB] flex gap-2">
              <Info className="w-4.5 h-4.5 text-[#FF8E9E] shrink-0 mt-0.5" />
              <p className="text-[11px] font-semibold leading-relaxed text-[#7A6456]">
                Để trống để dùng hệ thống server công cộng tự sửa lỗi của SnapVid. Nhập liên kết nếu bạn tự chạy Cobalt instance riêng.
              </p>
            </div>
          </div>
        </div>

        {/* Thông báo đã lưu */}
        {savedMessage && (
          <div className="mt-4 p-2 bg-[#A3E9C9]/30 text-[#2C6A4E] border-2 border-[#A3E9C9] rounded-xl text-center text-xs font-bold animate-pulse">
            {savedMessage}
          </div>
        )}

        {/* Nút hành động */}
        <div className="mt-6 flex justify-between gap-2">
          <button
            onClick={handleReset}
            className="flex items-center gap-1 px-4 py-2 bg-white hover:bg-[#FFF5F7] border-2 border-[#4A3B32] text-[#FF8E9E] font-bold rounded-xl bouncy-hover shadow-[2px_2px_0px_#4A3B32] text-xs"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Mặc Định
          </button>
          
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 border-2 border-[#4A3B32] text-[#4A3B32] font-bold rounded-xl bouncy-hover shadow-[2px_2px_0px_#4A3B32] text-xs"
            >
              Hủy
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-[#FF8E9E] hover:bg-[#ff7a8c] text-white font-bold rounded-xl bouncy-hover shadow-[2px_2px_0px_#4A3B32] text-xs"
            >
              Lưu Lại 🌸
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
