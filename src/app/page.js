"use client";

import React, { useState, useEffect } from 'react';
import DownloaderForm from '../components/DownloaderForm';
import VideoPreview from '../components/VideoPreview';
import SettingsModal from '../components/SettingsModal';
import LegalFooter, { DisclaimerModal } from '../components/LegalFooter';
import IntegrationGuide from '../components/IntegrationGuide';
import MonetizationGuide from '../components/MonetizationGuide';
import { Settings, HelpCircle, Sparkles, Heart } from 'lucide-react';

export default function Home() {
  const [result, setResult] = useState(null);
  const [defaultQuality, setDefaultQuality] = useState('720');
  const [customApiEndpoint, setCustomApiEndpoint] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [isEmbed, setIsEmbed] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Đọc cấu hình từ localStorage sau khi component mount (để tránh lỗi SSR)
  useEffect(() => {
    setMounted(true);
    
    // Kiểm tra chế độ nhúng Iframe (?embed=true)
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('embed') === 'true') {
        setIsEmbed(true);
      }

      // Đọc cấu hình đã lưu
      const savedQuality = localStorage.getItem('snapvid_quality');
      const savedEndpoint = localStorage.getItem('snapvid_endpoint');
      if (savedQuality) setDefaultQuality(savedQuality);
      if (savedEndpoint) setCustomApiEndpoint(savedEndpoint);
    }
  }, []);

  // Lưu cấu hình vào localStorage khi thay đổi
  const handleSetQuality = (q) => {
    setDefaultQuality(q);
    localStorage.setItem('snapvid_quality', q);
  };

  const handleSetEndpoint = (ep) => {
    setCustomApiEndpoint(ep);
    localStorage.setItem('snapvid_endpoint', ep);
  };

  if (!mounted) {
    return (
      <div className="flex flex-col flex-1 items-center justify-center min-h-screen bg-[#FFFBF0]">
        <div className="text-4xl animate-bounce">🌸</div>
        <p className="mt-2 font-bold text-[#8E7E73] text-sm">Đang tải SnapVid...</p>
      </div>
    );
  }

  // Chế độ nhúng (Embed Mode) - Ẩn bớt giao diện cồng kềnh, chỉ chừa lại Form và Preview
  if (isEmbed) {
    return (
      <main className="w-full max-w-2xl mx-auto p-4 space-y-4 bg-transparent">
        <DownloaderForm 
          onResult={setResult}
          defaultQuality={defaultQuality}
          customApiEndpoint={customApiEndpoint}
          embedMode={true}
        />
        {result && <VideoPreview result={result} />}
      </main>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      
      {/* 1. Header dễ thương */}
      <header className="w-full py-5 px-6 border-b-3 border-[#4A3B32] bg-white sticky top-0 z-40">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          
          {/* Logo Bouncy */}
          <div className="flex items-center gap-2">
            <span className="text-3xl cute-float">🌸</span>
            <span className="text-2xl font-black font-heading text-[#4A3B32] tracking-tight">
              Snap<span className="text-[#FF8E9E]">Vid</span>
            </span>
            <span className="hidden sm:inline-block text-[10px] font-bold px-2 py-0.5 bg-[#A3E9C9] border-2 border-[#4A3B32] rounded-full rotate-2">
              v1.0.0
            </span>
          </div>

          {/* Nút cài đặt & hướng dẫn */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setShowDisclaimer(true)}
              className="p-2.5 bg-white hover:bg-[#FFFBF0] text-[#4A3B32] border-2 border-[#4A3B32] rounded-2xl bouncy-hover shadow-[2px_2px_0px_#4A3B32] text-xs font-bold flex items-center gap-1"
              title="Điều khoản pháp lý"
            >
              <HelpCircle className="w-4 h-4 text-[#FF8E9E]" />
              <span className="hidden sm:inline">Pháp Lý</span>
            </button>
            
            <button
              onClick={() => setShowSettings(true)}
              className="p-2.5 bg-[#FF8E9E] hover:bg-[#ff7a8c] text-white border-2 border-[#4A3B32] rounded-2xl bouncy-hover shadow-[2px_2px_0px_#4A3B32] text-xs font-bold flex items-center gap-1"
              title="Cài đặt hệ thống"
            >
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Cài Đặt</span>
            </button>
          </div>

        </div>
      </header>

      {/* 2. Nội dung chính */}
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 py-8 space-y-8">
        
        {/* Banner chào mừng Bouncy */}
        <section className="text-center space-y-3 py-6 relative">
          <div className="absolute top-2 left-1/4 text-2xl animate-pulse hidden md:block">✨</div>
          <div className="absolute bottom-2 right-1/4 text-2xl animate-pulse hidden md:block">🌟</div>
          
          <h1 className="text-3xl md:text-5xl font-black font-heading text-[#4A3B32] leading-tight">
            Tải Video Đa Nền Tảng <br />
            <span className="text-[#FF8E9E] relative inline-block">
              Không Logo Dễ Thương!
              <span className="absolute bottom-1 left-0 w-full h-2 bg-[#FFE885] -z-10 rounded-full rotate-1"></span>
            </span>
          </h1>
          <p className="max-w-md mx-auto text-xs md:text-sm font-semibold text-[#8E7E73] leading-relaxed">
            Hỗ trợ lưu video chất lượng gốc từ TikTok, Douyin không logo, YouTube & Instagram Reels cực kỳ nhanh chóng và an toàn 🌸
          </p>
        </section>

        {/* Form Tải chính & Video Kết quả */}
        <section className="space-y-6">
          <div className="w-full p-6 bg-white border-3 border-[#4A3B32] rounded-[32px] shadow-[4px_4px_0px_#4A3B32]">
            <DownloaderForm 
              onResult={setResult}
              defaultQuality={defaultQuality}
              customApiEndpoint={customApiEndpoint}
            />
          </div>
          
          {result && <VideoPreview result={result} />}
        </section>

        {/* Hướng dẫn nhúng & Kiếm tiền (chỉ hiển thị ở chế độ bình thường) */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
          <IntegrationGuide />
          <MonetizationGuide />
        </section>

      </main>

      {/* 3. Chân trang */}
      <LegalFooter onShowDisclaimer={() => setShowDisclaimer(true)} />

      {/* 4. Modals bổ trợ */}
      <SettingsModal 
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        defaultQuality={defaultQuality}
        setDefaultQuality={handleSetQuality}
        customApiEndpoint={customApiEndpoint}
        setCustomApiEndpoint={handleSetEndpoint}
      />

      <DisclaimerModal 
        isOpen={showDisclaimer}
        onClose={() => setShowDisclaimer(false)}
      />

    </div>
  );
}
