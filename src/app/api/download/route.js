import { NextResponse } from 'next/server';

const DEFAULT_COBALT_INSTANCES = [
  'https://fox.kittycat.boo',
  'https://dog.kittycat.boo'
];

export async function POST(request) {
  try {
    const body = await request.json();
    const { url, quality = '720', customApiEndpoint } = body;

    if (!url) {
      return NextResponse.json({ success: false, error: 'Vui lòng cung cấp link video!' }, { status: 400 });
    }

    // 1. Tự động nhận diện nền tảng
    const lowerUrl = url.toLowerCase();
    let platform = 'unknown';
    if (lowerUrl.includes('tiktok.com') || lowerUrl.includes('douyin.com')) {
      platform = 'tiktok';
    } else if (lowerUrl.includes('youtube.com') || lowerUrl.includes('youtu.be')) {
      platform = 'youtube';
    } else if (lowerUrl.includes('instagram.com')) {
      platform = 'instagram';
    }

    // 2. Xử lý tải TikTok / Douyin qua TikWM (Không cần API Key, không logo)
    if (platform === 'tiktok') {
      try {
        const response = await fetch('https://www.tikwm.com/api/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            url: url,
            hd: '1'
          })
        });

        const result = await response.json();
        if (result && result.code === 0 && result.data) {
          const data = result.data;
          const downloads = [];

          // Helper để chuẩn hoá liên kết, tránh tự ghép "https://www.tikwm.com" nếu link đã là tuyệt đối
          const formatTikWMUrl = (path) => {
            if (!path) return '';
            if (path.startsWith('http://') || path.startsWith('https://')) {
              return path;
            }
            if (path.startsWith('//')) {
              return `https:${path}`;
            }
            return `https://www.tikwm.com${path}`;
          };

          // Helper để dọn dẹp tên file tải xuống cho đẹp
          const cleanFilename = (str, ext = 'mp4') => {
            if (!str) return `video.${ext}`;
            // Loại bỏ emoji và ký tự đặc biệt, chỉ giữ lại chữ, số, dấu cách, gạch ngang, gạch dưới
            let clean = str.replace(/[^\p{L}\p{N}\s\-_]/gu, '').trim();
            clean = clean.replace(/\s+/g, ' '); // Rút gọn khoảng trắng liên tiếp
            clean = clean.substring(0, 50).trim() || 'video';
            return `${clean}.${ext}`;
          };

          // Helper để tạo link tải trực tiếp thông qua Proxy
          const getProxyUrl = (directUrl, filename) => {
            return `/api/proxy?url=${encodeURIComponent(directUrl)}&filename=${encodeURIComponent(filename)}`;
          };

          if (data.play) {
            const fileUrl = formatTikWMUrl(data.play);
            downloads.push({ 
              label: 'Video HD (Không Logo)', 
              url: getProxyUrl(fileUrl, cleanFilename(data.title || 'tiktok-video', 'mp4')), 
              quality: 'SD' 
            });
          }
          // Bỏ tuỳ chọn wmplay (Video Có Logo) theo yêu cầu của bạn

          if (data.music) {
            const fileUrl = formatTikWMUrl(data.music);
            downloads.push({ 
              label: 'Nhạc Nền MP3 (Audio)', 
              url: getProxyUrl(fileUrl, cleanFilename(data.title || 'tiktok-audio', 'mp3')), 
              quality: 'Audio' 
            });
          }

          return NextResponse.json({
            success: true,
            platform: 'tiktok',
            title: data.title || 'Video TikTok',
            author: data.author?.nickname || 'TikTok User',
            avatar: data.author?.avatar ? formatTikWMUrl(data.author.avatar) : null,
            cover: data.cover ? formatTikWMUrl(data.cover) : null,
            duration: data.duration || 0,
            downloads: downloads
          });
        } else {
          throw new Error(result?.msg || 'Không thể bóc tách dữ liệu TikTok từ TikWM');
        }
      } catch (tiktokError) {
        console.error('TikTok download failed, trying Cobalt fallback:', tiktokError.message);
        // Nếu TikWM lỗi, cho phép chạy tiếp xuống Cobalt như một giải pháp dự phòng
      }
    }

    // 3. Xử lý tải YouTube, Instagram (hoặc TikTok dự phòng) qua Cobalt
    const endpoints = [];
    if (customApiEndpoint) {
      endpoints.push(customApiEndpoint.replace(/\/$/, '')); // Bỏ dấu / ở cuối nếu có
    }
    endpoints.push(...DEFAULT_COBALT_INSTANCES);

    let lastError = null;

    for (const endpoint of endpoints) {
      try {
        console.log(`Đang thử tải qua Cobalt instance: ${endpoint}`);
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
          },
          body: JSON.stringify({
            url: url,
            videoQuality: quality
          }),
          signal: AbortSignal.timeout(10000) // Timeout 10 giây mỗi instance để tránh treo
        });

        if (!response.ok) {
          throw new Error(`HTTP Error ${response.status} from ${endpoint}`);
        }

        const data = await response.json();

        // Định dạng phản hồi của Cobalt:
        // status có các giá trị: 'stream', 'redirect', 'picker', 'success', 'error'
        if (data.status === 'error') {
          throw new Error(data.text || 'Lỗi không xác định từ máy chủ Cobalt');
        }

        if (data.url || data.status === 'picker') {
          const downloads = [];

          // Helper dọn dẹp tên file
          const cleanFilename = (str, ext = 'mp4') => {
            if (!str) return `video.${ext}`;
            let clean = str.replace(/[^\p{L}\p{N}\s\-_]/gu, '').trim();
            clean = clean.replace(/\s+/g, ' ');
            clean = clean.substring(0, 50).trim() || 'video';
            return `${clean}.${ext}`;
          };

          if (data.status === 'picker' && Array.isArray(data.picker)) {
            // Trường hợp tải nhiều ảnh/video (ví dụ: Instagram Slide)
            data.picker.forEach((item, index) => {
              const ext = item.type === 'photo' ? 'jpg' : 'mp4';
              const fileUrl = item.url;
              const name = `item_${index + 1}.${ext}`;
              downloads.push({
                label: `Mục ${index + 1} (${item.type === 'photo' ? 'Ảnh' : 'Video'})`,
                url: `/api/proxy?url=${encodeURIComponent(fileUrl)}&filename=${encodeURIComponent(name)}`,
                quality: 'Default'
              });
            });
          } else if (data.url) {
            // Tải đơn lẻ
            const fileUrl = data.url;
            const rawFilename = data.filename || 'media.mp4';
            downloads.push({
              label: platform === 'youtube' ? `Tải Video (${quality}p)` : 'Tải Video / Media',
              url: `/api/proxy?url=${encodeURIComponent(fileUrl)}&filename=${encodeURIComponent(rawFilename)}`,
              quality: quality
            });
          }

          return NextResponse.json({
            success: true,
            platform: platform !== 'unknown' ? platform : 'media',
            title: data.filename || 'Tập tin đa phương tiện',
            author: 'SnapVid Downloader',
            avatar: null,
            cover: null,
            downloads: downloads
          });
        }
      } catch (err) {
        console.warn(`Lỗi khi gọi API tại ${endpoint}:`, err.message);
        lastError = err.message;
        // Tiếp tục vòng lặp để thử máy chủ tiếp theo
      }
    }

    return NextResponse.json({
      success: false,
      error: `Không thể tải video từ link này. Máy chủ phản hồi: ${lastError || 'Lỗi kết nối'}. Vui lòng thử lại sau hoặc đổi chất lượng video.`
    }, { status: 500 });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ success: false, error: 'Đã xảy ra lỗi hệ thống! Vui lòng thử lại sau.' }, { status: 500 });
  }
}
