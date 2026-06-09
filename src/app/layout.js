import { Fredoka, Quicksand } from "next/font/google";
import "./globals.css";

const fredoka = Fredoka({
  variable: "--font-fredoka",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const quicksand = Quicksand({
  variable: "--font-quicksand",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata = {
  title: "SnapVid 🌸 Tải Video TikTok, Douyin, YouTube, Instagram Siêu Dễ Thương",
  description: "Trang web tải video đa nền tảng không logo, không watermark, chất lượng cao với giao diện pastel cực đáng yêu và dễ thương!",
  icons: {
    icon: "/favicon.ico",
  }
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="vi"
      className={`${fredoka.variable} ${quicksand.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-[#FFFBF0] text-[#4A3B32]">
        {children}
      </body>
    </html>
  );
}

