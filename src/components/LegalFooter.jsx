import React, { useState } from 'react';
import { ShieldCheck, Heart, AlertCircle, HelpCircle } from 'lucide-react';

export default function LegalFooter({ onShowDisclaimer }) {
  return (
    <footer className="w-full mt-auto py-8 px-4 border-t-3 border-[#4A3B32] bg-[#FFF8E7] text-[#5c4a3f]">
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Bản quyền */}
        <div className="flex items-center gap-2 text-sm md:text-base font-semibold">
          <span>© {new Date().getFullYear()}</span>
          <span className="font-heading text-[#FF8E9E] font-bold text-lg">SnapVid</span>
          <span>• Được làm với</span>
          <Heart className="w-4.5 h-4.5 fill-[#FF8E9E] stroke-[#FF8E9E] animate-pulse" />
          <span>cho Cộng đồng</span>
        </div>

        {/* Các liên kết điều khoản */}
        <div className="flex flex-wrap justify-center gap-4 text-sm font-semibold">
          <button 
            onClick={onShowDisclaimer}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white hover:bg-[#FDF3DB] border-2 border-[#4A3B32] bouncy-hover shadow-[2px_2px_0px_#4A3B32] text-xs md:text-sm"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            Tuyên bố Pháp lý & Bản quyền
          </button>
        </div>
      </div>
    </footer>
  );
}

export function DisclaimerModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg p-6 bg-white bubble-shadow-brown rounded-3xl animate-scale-up max-h-[85vh] overflow-y-auto">
        <div className="flex items-center gap-2.5 mb-4 text-[#FF8E9E]">
          <ShieldCheck className="w-7 h-7 stroke-[2.5]" />
          <h2 className="text-2xl font-heading text-[#4A3B32]">Điều Khoản & Pháp Lý</h2>
        </div>

        <div className="space-y-4 text-sm leading-relaxed text-[#5c4a3f] font-medium">
          <div className="p-3 bg-[#FFFBF0] rounded-2xl border-2 border-[#FDF3DB] flex gap-2">
            <AlertCircle className="w-5 h-5 text-[#FF8E9E] shrink-0 mt-0.5" />
            <p className="text-xs font-bold text-[#7A6456]">
              Vui lòng đọc kỹ trước khi sử dụng công cụ SnapVid. Chúng tôi tin rằng bạn là một người dùng đáng yêu và có trách nhiệm! 🌸
            </p>
          </div>

          <section className="space-y-2">
            <h3 className="font-bold text-[#4A3B32] flex items-center gap-1 text-base">
              🌸 1. Mục Đích Sử Dụng
            </h3>
            <p>
              SnapVid là công cụ hỗ trợ người dùng tải về nội dung phục vụ cho mục đích <strong>lưu trữ cá nhân, học tập, nghiên cứu phi thương mại</strong>. Nghiêm cấm sử dụng công cụ này để phát tán nội dung trái phép hoặc xâm phạm quyền sở hữu trí tuệ của tác giả.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="font-bold text-[#4A3B32] flex items-center gap-1 text-base">
              🌸 2. Quyền Sở Hữu Bản Quyền
            </h3>
            <p>
              Tất cả bản quyền hình ảnh, âm thanh, video thuộc về tác giả gốc của video đó. SnapVid <strong>không sở hữu, không lưu trữ</strong> bất kỳ video nào trên máy chủ của mình. Mọi liên kết tải về đều được dẫn trực tiếp từ máy chủ phân phối nội dung (CDN) của nền tảng tương ứng (TikTok, YouTube, Instagram).
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="font-bold text-[#4A3B32] flex items-center gap-1 text-base">
              🌸 3. Tuyên Bố Miễn Trừ Trách Nhiệm
            </h3>
            <p>
              Người dùng tự chịu hoàn toàn trách nhiệm pháp lý khi sử dụng các tệp tin đã tải về. SnapVid không chịu trách nhiệm đối với bất kỳ khiếu nại, tổn thất hay tranh chấp bản quyền nào phát sinh giữa người dùng và tác giả video gốc hoặc các bên thứ ba liên quan.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="font-bold text-[#4A3B32] flex items-center gap-1 text-base">
              🌸 4. Thương Hiệu Độc Lập
            </h3>
            <p>
              SnapVid là một dịch vụ độc lập và <strong>không liên kết, không đại diện, không được tài trợ</strong> bởi TikTok, ByteDance, YouTube, Google, Instagram hay Meta. Các tên thương hiệu chỉ được dùng với mục đích mô tả khả năng tương thích nền tảng.
            </p>
          </section>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-[#FF8E9E] hover:bg-[#ff7a8c] text-white font-bold rounded-2xl border-2 border-[#4A3B32] bouncy-hover shadow-[2px_2px_0px_#4A3B32] text-sm"
          >
            Đã Hiểu và Đồng Ý 🌸
          </button>
        </div>
      </div>
    </div>
  );
}
