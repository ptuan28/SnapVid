import React, { useEffect } from 'react';
import { Download, Music, User, Clock, Film, ExternalLink, HelpCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function VideoPreview({ result }) {
  // Bắn pháo hoa giấy chúc mừng khi có kết quả thành công!
  useEffect(() => {
    if (result && result.success) {
      // Bắn 3 đợt pháo hoa liên tục cho đáng yêu!
      const duration = 1.5 * 1000;
      const end = Date.now() + duration;

      (function frame() {
        confetti({
          particleCount: 3,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#FF8E9E', '#FFE885', '#A7E3FF']
        });
        confetti({
          particleCount: 3,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#FF8E9E', '#FFE885', '#A7E3FF']
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      }());
    }
  }, [result]);

  if (!result || !result.success) return null;

  const { title, author, avatar, cover, duration, downloads, platform } = result;

  const formatDuration = (sec) => {
    if (!sec) return null;
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const getPlatformIcon = () => {
    switch (platform) {
      case 'tiktok':
      case 'douyin':
        return '🎵';
      case 'youtube':
        return '📺';
      case 'instagram':
        return '📸';
      default:
        return '🎬';
    }
  };

  // Trả về màu nền của nút tuỳ thuộc chất lượng
  const getButtonClass = (quality) => {
    if (quality === 'HD' || quality === '1080') {
      return 'bg-[#FF8E9E] hover:bg-[#ff7a8c] text-white bubble-shadow-pink';
    } else if (quality === 'SD' || quality === '720') {
      return 'bg-[#A7E3FF] hover:bg-[#8fd5ff] text-[#4A3B32] bubble-shadow-sky';
    } else if (quality === 'Audio' || quality === 'mp3') {
      return 'bg-[#FFE885] hover:bg-[#ffd94a] text-[#4A3B32] bubble-shadow-yellow';
    } else {
      return 'bg-[#A3E9C9] hover:bg-[#88e0b7] text-[#4A3B32] bubble-shadow-mint';
    }
  };

  return (
    <div className="w-full p-5 bg-white border-3 border-[#4A3B32] rounded-[32px] shadow-[4px_4px_0px_#4A3B32] flex flex-col md:flex-row gap-6 animate-scale-up">
      
      {/* 1. Ảnh bìa video (Cover) */}
      <div className="relative w-full md:w-56 shrink-0 aspect-video md:aspect-square rounded-2xl border-3 border-[#4A3B32] overflow-hidden bg-[#FDF3DB] flex items-center justify-center shadow-[2px_2px_0px_#4A3B32]">
        {cover ? (
          <img 
            src={cover} 
            alt={title} 
            className="w-full h-full object-cover" 
            onError={(e) => {
              // Dự phòng nếu ảnh lỗi do CORS hoặc link hết hạn
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
        ) : null}
        
        {/* Placeholder khi không có cover hoặc cover bị lỗi */}
        <div className={`absolute inset-0 flex flex-col items-center justify-center text-4xl gap-2 font-bold ${cover ? 'hidden' : 'flex'}`}>
          <span className="cute-float">{getPlatformIcon()}</span>
          <span className="text-xs text-[#8E7E73] font-bold">SnapVid Downloader</span>
        </div>

        {/* Thời lượng video */}
        {duration ? (
          <div className="absolute bottom-2 right-2 px-2 py-0.5 bg-black/60 text-white text-[10px] font-bold rounded-lg flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {formatDuration(duration)}
          </div>
        ) : null}
      </div>

      {/* 2. Chi tiết video & Các nút tải về */}
      <div className="flex-1 flex flex-col justify-between space-y-4">
        
        {/* Tác giả & Tiêu đề */}
        <div className="space-y-2">
          {/* Avatar & Tên tác giả */}
          <div className="flex items-center gap-2">
            {avatar ? (
              <img src={avatar} alt={author} className="w-6 h-6 rounded-full border border-[#4A3B32]" />
            ) : (
              <div className="p-1 bg-pink-100 rounded-full border border-[#4A3B32] text-xs">👤</div>
            )}
            <span className="text-xs font-bold text-[#8E7E73]">{author || 'Kênh truyền thông'}</span>
          </div>

          {/* Tiêu đề video */}
          <h4 className="text-lg font-bold font-heading text-[#4A3B32] line-clamp-3 leading-snug">
            {title || 'Tập tin video của cậu tải về thành công rồi nè! ✨'}
          </h4>
        </div>

        {/* Các nút tải về */}
        <div className="space-y-3">
          <div className="flex items-center gap-1 text-xs font-bold text-[#4A3B32]">
            <Film className="w-4 h-4 text-[#FF8E9E]" />
            Lựa chọn link tải xuống bên dưới:
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {downloads && downloads.length > 0 ? (
              downloads.map((dl, index) => (
                <a
                  key={index}
                  href={dl.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`px-4 py-3 text-xs md:text-sm font-bold rounded-xl flex items-center justify-center gap-2 text-center bouncy-hover transition-all ${getButtonClass(dl.quality)}`}
                >
                  {dl.quality === 'Audio' ? <Music className="w-4 h-4" /> : <Download className="w-4 h-4" />}
                  {dl.label}
                  <ExternalLink className="w-3 h-3 opacity-60 ml-0.5" />
                </a>
              ))
            ) : (
              <p className="text-xs font-bold text-[#FF8E9E]">Cậu ơi, không tìm thấy tuỳ chọn tải nào khả thi rồi 😿</p>
            )}
          </div>
        </div>

        {/* Hướng dẫn cách lưu trên điện thoại/máy tính */}
        <div className="p-3 bg-[#FFFBF0] rounded-2xl border-2 border-[#4A3B32]/10 flex gap-2">
          <HelpCircle className="w-5 h-5 text-[#FF8E9E] shrink-0 mt-0.5" />
          <p className="text-[11px] font-semibold leading-relaxed text-[#7A6456]">
            <strong>Mẹo tải về:</strong> Nếu nhấp vào nút tải mà video tự động mở ở tab mới thay vì tải về máy: Cậu hãy <strong>giữ đè vào nút tải</strong> (trên điện thoại) hoặc <strong>nhấp chuột phải vào nút tải</strong> (trên máy tính) rồi chọn <strong>&quot;Tải liên kết xuống&quot;</strong> hoặc <strong>&quot;Lưu liên kết thành...&quot;</strong> nhé! 🌸
          </p>
        </div>

      </div>

    </div>
  );
}
