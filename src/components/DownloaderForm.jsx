import React, { useState, useEffect } from 'react';
import { ArrowRight, Sparkles, AlertCircle, RefreshCw, Star } from 'lucide-react';

export default function DownloaderForm({ onResult, customApiEndpoint, defaultQuality, embedMode = false }) {
  const [url, setUrl] = useState('');
  const [detectedPlatform, setDetectedPlatform] = useState('');
  const [quality, setQuality] = useState(defaultQuality);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Cập nhật quality từ props nếu mặc định thay đổi
  useEffect(() => {
    setQuality(defaultQuality);
  }, [defaultQuality]);

  // Phân tích URL để tự động nhận diện nền tảng
  useEffect(() => {
    if (!url) {
      setDetectedPlatform('');
      setError('');
      return;
    }

    const lowerUrl = url.toLowerCase();
    if (lowerUrl.includes('tiktok.com') || lowerUrl.includes('vt.tiktok.com')) {
      setDetectedPlatform('tiktok');
    } else if (lowerUrl.includes('douyin.com')) {
      setDetectedPlatform('douyin');
    } else if (lowerUrl.includes('youtube.com') || lowerUrl.includes('youtu.be')) {
      setDetectedPlatform('youtube');
    } else if (lowerUrl.includes('instagram.com') || lowerUrl.includes('instagram.com/reel')) {
      setDetectedPlatform('instagram');
    } else {
      setDetectedPlatform('unknown');
    }
  }, [url]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!url) {
      setError('Cậu ơi, dán link video vào đây đã nhé! 🌸');
      return;
    }

    setLoading(true);
    setError('');
    onResult(null); // Reset kết quả cũ trước đó

    try {
      const response = await fetch('/api/download', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: url,
          quality: quality,
          customApiEndpoint: customApiEndpoint
        })
      });

      const data = await response.json();

      if (data && data.success) {
        onResult(data);
      } else {
        setError(data.error || 'Có lỗi gì đó xảy ra mất rồi! Thử máy chủ khác hoặc kiểm tra lại link cậu nhé! 😿');
      }
    } catch (err) {
      console.error('Download error:', err);
      setError('Kết nối mạng bị trục trặc rồi, cậu thử lại xem sao nhé! ☁️');
    } finally {
      setLoading(false);
    }
  };

  const getPlatformBadge = () => {
    switch (detectedPlatform) {
      case 'tiktok':
        return (
          <span className="flex items-center gap-1 text-[11px] font-bold px-3 py-1 bg-[#A7E3FF] text-[#4A3B32] border-2 border-[#4A3B32] rounded-full animate-bounce">
            🎵 Phát hiện TikTok nè!
          </span>
        );
      case 'douyin':
        return (
          <span className="flex items-center gap-1 text-[11px] font-bold px-3 py-1 bg-[#FFE885] text-[#4A3B32] border-2 border-[#4A3B32] rounded-full animate-bounce">
            🇨🇳 Phát hiện Douyin (TikTok Trung)!
          </span>
        );
      case 'youtube':
        return (
          <span className="flex items-center gap-1 text-[11px] font-bold px-3 py-1 bg-[#FF8E9E] text-white border-2 border-[#4A3B32] rounded-full animate-bounce">
            📺 Phát hiện YouTube kìa!
          </span>
        );
      case 'instagram':
        return (
          <span className="flex items-center gap-1 text-[11px] font-bold px-3 py-1 bg-[#A3E9C9] text-[#4A3B32] border-2 border-[#4A3B32] rounded-full animate-bounce">
            📸 Phát hiện Instagram xinh xắn!
          </span>
        );
      case 'unknown':
        return (
          <span className="flex items-center gap-1 text-[11px] font-bold px-3 py-1 bg-gray-200 text-[#4A3B32] border-2 border-[#4A3B32] rounded-full">
            🔗 Link này lạ ghê (vẫn thử tải nha)
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-4">
      {/* Khung dán link */}
      <div className="space-y-1.5">
        <label className="block text-sm font-bold text-[#4A3B32] flex justify-between items-center px-1">
          <span className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-[#FFE885] stroke-[#4A3B32] stroke-2" />
            Nhập liên kết video cần tải:
          </span>
          {getPlatformBadge()}
        </label>
        
        <div className="relative flex flex-col md:flex-row gap-3">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            disabled={loading}
            placeholder="Dán link TikTok, Douyin, YouTube, Instagram..."
            className="flex-1 px-5 py-4 rounded-2xl border-3 border-[#4A3B32] bg-[#FFFBF0] text-[#4A3B32] placeholder-[#A09085] focus:outline-none focus:ring-3 focus:ring-[#FF8E9E]/40 font-semibold shadow-[3px_3px_0px_#4A3B32] disabled:opacity-75"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-4 bg-[#FF8E9E] hover:bg-[#ff7a8c] text-white font-bold rounded-2xl border-3 border-[#4A3B32] bouncy-hover shadow-[4px_4px_0px_#4A3B32] active:translate-x-1 active:translate-y-1 active:shadow-[1px_1px_0px_#4A3B32] transition-all flex items-center justify-center gap-2 disabled:opacity-75 disabled:cursor-not-allowed text-base"
          >
            {loading ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                Đang Phân Tích...
              </>
            ) : (
              <>
                Tải Video Ngay
                <ArrowRight className="w-5 h-5 stroke-[2.5]" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Điều chỉnh chất lượng cho YouTube */}
      {detectedPlatform === 'youtube' && (
        <div className="p-4 bg-[#FFF8E7] rounded-2xl border-2 border-[#4A3B32] shadow-[2px_2px_0px_#4A3B32] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 animate-fade-in">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#FFE885] fill-[#FFE885] stroke-[#4A3B32] stroke-2" />
            <span className="text-sm font-bold text-[#4A3B32]">Chọn chất lượng video (YouTube):</span>
          </div>
          <div className="flex gap-1.5">
            {['1080', '720', '480', '360'].map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => setQuality(q)}
                className={`px-3 py-1 text-xs font-bold rounded-xl border-2 border-[#4A3B32] bouncy-hover ${
                  quality === q
                    ? 'bg-[#FF8E9E] text-white'
                    : 'bg-white text-[#4A3B32] hover:bg-[#FFFBF0]'
                }`}
              >
                {q}p
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Thông báo lỗi */}
      {error && (
        <div className="p-4 bg-[#FFF5F7] border-2 border-[#FFC5CD] text-[#A94442] rounded-2xl flex items-start gap-2.5 shadow-[2px_2px_0px_#FFC5CD] animate-bounce-short">
          <AlertCircle className="w-5 h-5 text-[#FF8E9E] shrink-0 mt-0.5" />
          <p className="text-xs md:text-sm font-bold leading-normal">{error}</p>
        </div>
      )}
    </form>
  );
}
