import React, { useState } from 'react';
import { Code, Copy, Check, Info, Layout, Layers } from 'lucide-react';

export default function IntegrationGuide() {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('iframe');

  const iframeCode = `<iframe 
  src="https://snapvid-web.vercel.app/?embed=true" 
  width="100%" 
  height="480" 
  style="border: none; border-radius: 24px; box-shadow: 0 8px 30px rgba(0,0,0,0.06);"
  title="SnapVid Downloader"
></iframe>`;

  const widgetCode = `// 1. Cài đặt các thư viện cần thiết: npm install lucide-react framer-motion canvas-confetti
// 2. Tải mã nguồn component DownloaderForm.jsx và nhúng trực tiếp:
import SnapVidDownloader from './components/DownloaderForm';

export default function ClubPage() {
  return (
    <div className="max-w-2xl mx-auto p-6 bg-pink-50 rounded-3xl border-3 border-[#4A3B32]">
      <h2 className="text-2xl font-bold font-heading text-center mb-4">Tải Video CLB 🎬</h2>
      <SnapVidDownloader embedMode={true} />
    </div>
  );
}`;

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="w-full p-6 bg-white border-3 border-[#4A3B32] rounded-[32px] shadow-[4px_4px_0px_#4A3B32] space-y-5">
      <div className="flex items-center gap-2 text-[#A7E3FF]">
        <div className="p-2 bg-[#A7E3FF]/20 border-2 border-[#4A3B32] rounded-2xl">
          <Code className="w-6 h-6 text-[#2983B3] stroke-2" />
        </div>
        <div>
          <h3 className="text-xl font-heading text-[#4A3B32] leading-tight">Tích Hợp Vào Web CLB</h3>
          <p className="text-xs text-[#8E7E73] font-semibold">Nhúng công cụ SnapVid vào trang web của câu lạc bộ</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-2 border-[#4A3B32] rounded-xl overflow-hidden text-sm font-bold bg-[#FFFBF0]">
        <button
          onClick={() => setActiveTab('iframe')}
          className={`flex-1 py-2 flex items-center justify-center gap-1.5 bouncy-hover ${
            activeTab === 'iframe'
              ? 'bg-[#A7E3FF] text-[#4A3B32] border-r-2 border-[#4A3B32]'
              : 'bg-white text-[#8E7E73] hover:text-[#4A3B32] border-r-2 border-[#4A3B32]'
          }`}
        >
          <Layout className="w-4 h-4" />
          Nhúng Iframe (Đơn giản nhất)
        </button>
        <button
          onClick={() => setActiveTab('widget')}
          className={`flex-1 py-2 flex items-center justify-center gap-1.5 bouncy-hover ${
            activeTab === 'widget'
              ? 'bg-[#A7E3FF] text-[#4A3B32]'
              : 'bg-white text-[#8E7E73] hover:text-[#4A3B32]'
          }`}
        >
          <Layers className="w-4 h-4" />
          Nhúng React Component
        </button>
      </div>

      {/* Content */}
      <div className="space-y-4">
        {activeTab === 'iframe' ? (
          <div className="space-y-3">
            <p className="text-xs md:text-sm font-semibold leading-relaxed text-[#5c4a3f]">
              Cách dễ nhất để đưa SnapVid vào web chính của câu lạc bộ là sử dụng thẻ <code>&lt;iframe&gt;</code>. Khi ở chế độ <code>?embed=true</code>, giao diện sẽ tự động ẩn header, footer và chỉ hiển thị khung tải nhỏ gọn, chuyên nghiệp.
            </p>
            <div className="relative">
              <pre className="p-4 bg-[#4A3B32] text-[#EADED5] rounded-2xl overflow-x-auto text-[11px] font-mono leading-relaxed max-h-[150px] border-2 border-[#4A3B32]">
                {iframeCode}
              </pre>
              <button
                onClick={() => copyToClipboard(iframeCode)}
                className="absolute top-2 right-2 p-2 bg-white hover:bg-[#FFFBF0] text-[#4A3B32] rounded-xl border-2 border-[#4A3B32] bouncy-hover shadow-[2px_2px_0px_#4A3B32] text-xs font-bold flex items-center gap-1"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Đã chép' : 'Sao chép'}
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-xs md:text-sm font-semibold leading-relaxed text-[#5c4a3f]">
              Nếu web chính của CLB sử dụng React hoặc Next.js, bạn có thể bê trực tiếp component của dự án này để nhúng. Sử dụng thuộc tính <code>embedMode=&#123;true&#125;</code> để ẩn bớt các phần không cần thiết.
            </p>
            <div className="relative">
              <pre className="p-4 bg-[#4A3B32] text-[#EADED5] rounded-2xl overflow-x-auto text-[10px] md:text-[11px] font-mono leading-relaxed max-h-[220px] border-2 border-[#4A3B32]">
                {widgetCode}
              </pre>
              <button
                onClick={() => copyToClipboard(widgetCode)}
                className="absolute top-2 right-2 p-2 bg-white hover:bg-[#FFFBF0] text-[#4A3B32] rounded-xl border-2 border-[#4A3B32] bouncy-hover shadow-[2px_2px_0px_#4A3B32] text-xs font-bold flex items-center gap-1"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Đã chép' : 'Sao chép'}
              </button>
            </div>
          </div>
        )}

        <div className="p-3 bg-[#FFF8E7] rounded-2xl border-2 border-[#FDF3DB] flex gap-2">
          <Info className="w-5 h-5 text-[#FF8E9E] shrink-0 mt-0.5" />
          <p className="text-xs font-semibold leading-relaxed text-[#7A6456]">
            <strong>Mẹo:</strong> Hãy thay thế URL trong đoạn code nhúng bằng tên miền thực tế của trang web SnapVid của bạn sau khi deploy thành công lên Vercel/GitHub Pages để công cụ hoạt động!
          </p>
        </div>
      </div>
    </section>
  );
}
