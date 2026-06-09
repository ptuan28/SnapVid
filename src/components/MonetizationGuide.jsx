import React from 'react';
import { DollarSign, Percent, Coffee, Crown, ShieldAlert } from 'lucide-react';

export default function MonetizationGuide() {
  const methods = [
    {
      icon: <DollarSign className="w-6 h-6 text-emerald-500" />,
      title: "Mạng Quảng Cáo (Ad Networks)",
      bg: "bg-emerald-50",
      border: "border-emerald-200",
      badge: "Phổ biến nhất",
      badgeColor: "bg-emerald-500 text-white",
      desc: "Đặt biểu ngữ (Banner) hoặc quảng cáo pop-under. Các công cụ tải video có lượng traffic lặp lại rất cao, đem lại nguồn thu nhập thụ động ổn định từ lượt hiển thị (CPM).",
      tips: "Dùng PopAds, PropellerAds nếu khó đăng ký Google AdSense. Tránh đặt quá nhiều quảng cáo pop-up để giữ chân người dùng dễ thương."
    },
    {
      icon: <Percent className="w-6 h-6 text-[#A7E3FF]" />,
      title: "Tiếp Thị Liên Kết (Affiliate)",
      bg: "bg-blue-50",
      border: "border-blue-200",
      badge: "Lợi nhuận cao",
      badgeColor: "bg-blue-500 text-white",
      desc: "Người dùng tải video thường quan tâm đến bảo mật và sáng tạo nội dung. Đặt liên kết giới thiệu mua VPN (NordVPN, AtlasVPN) hoặc phần mềm chỉnh sửa video (CapCut Pro, Canva).",
      tips: "Tham gia các mạng như Accesstrade hoặc CJ Affiliate. Tạo một banner nhỏ xinh ở trang download thành công."
    },
    {
      icon: <Coffee className="w-6 h-6 text-[#FFE885]" />,
      title: "Quyên Góp Từ Người Dùng (Donations)",
      bg: "bg-amber-50",
      border: "border-amber-200",
      badge: "Phù hợp CLB",
      badgeColor: "bg-amber-500 text-[#4A3B32]",
      desc: "Vì đây là một công cụ miễn phí, sạch sẽ và không có quảng cáo độc hại, cộng đồng sẽ rất sẵn lòng mời bạn một ly cà phê để duy trì máy chủ.",
      tips: "Tích hợp ví MoMo, tài khoản ngân hàng (VietQR) hoặc nút 'Buy Me a Coffee' ngay dưới form tải video."
    },
    {
      icon: <Crown className="w-6 h-6 text-[#FF8E9E]" />,
      title: "Mô Hình Hội Viên (Premium)",
      bg: "bg-pink-50",
      border: "border-pink-200",
      badge: "Chuyên nghiệp",
      badgeColor: "bg-pink-500 text-white",
      desc: "Chia tính năng làm hai cấp. Cấp miễn phí tải tối đa 720p và có quảng cáo. Cấp Premium tải chất lượng gốc 1080p/4K, không quảng cáo và tải cực nhanh.",
      tips: "Sử dụng các hệ thống cổng thanh toán tự động để nâng cấp tài khoản tự động khi người dùng chuyển khoản."
    }
  ];

  return (
    <section className="w-full p-6 bg-white border-3 border-[#4A3B32] rounded-[32px] shadow-[4px_4px_0px_#4A3B32] space-y-6">
      
      {/* Tiêu đề */}
      <div className="flex items-center gap-2">
        <div className="p-2 bg-[#FFE885]/20 border-2 border-[#4A3B32] rounded-2xl">
          <Coffee className="w-6 h-6 text-[#D9B41B] stroke-2" />
        </div>
        <div>
          <h3 className="text-xl font-heading text-[#4A3B32] leading-tight">Nghiên Cứu Kiếm Tiền</h3>
          <p className="text-xs text-[#8E7E73] font-semibold">Khám phá các cách thức tạo doanh thu từ trang SnapVid</p>
        </div>
      </div>

      {/* Grid danh sách */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {methods.map((method, idx) => (
          <div 
            key={idx} 
            className={`p-4 rounded-2xl border-2 border-[#4A3B32] shadow-[3px_3px_0px_#4A3B32] ${method.bg} flex flex-col justify-between space-y-3 bouncy-hover`}
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="p-1.5 bg-white border-2 border-[#4A3B32] rounded-xl">
                  {method.icon}
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border-2 border-[#4A3B32] ${method.badgeColor}`}>
                  {method.badge}
                </span>
              </div>
              <h4 className="font-heading text-base text-[#4A3B32]">{method.title}</h4>
              <p className="text-xs leading-relaxed text-[#5c4a3f] font-medium">{method.desc}</p>
            </div>
            
            <div className="pt-2 border-t border-[#4A3B32]/10 text-[11px] font-semibold text-[#7A6456]">
              💡 <strong>Mẹo:</strong> {method.tips}
            </div>
          </div>
        ))}
      </div>

      {/* Cảnh báo pháp lý nhỏ */}
      <div className="p-3 bg-[#FFF5F7] rounded-2xl border-2 border-[#FFC5CD] flex gap-2">
        <ShieldAlert className="w-4.5 h-4.5 text-[#FF8E9E] shrink-0 mt-0.5" />
        <p className="text-[11px] font-semibold leading-relaxed text-[#A94442]">
          <strong>Lưu ý quan trọng:</strong> Khi kiếm tiền từ web tải video, bạn cần đảm bảo tuân thủ đầy đủ các tuyên bố miễn trừ trách nhiệm bản quyền để tránh các vấn đề pháp lý không đáng có với bên nắm giữ bản quyền gốc.
        </p>
      </div>

    </section>
  );
}
