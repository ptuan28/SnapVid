import { NextResponse } from 'next/server';

// Danh sách các máy chủ Cobalt API công cộng được sử dụng làm phương án dự phòng (fallback)
const DEFAULT_COBALT_INSTANCES = [
  'https://cobalt.api.ryz.cx',
  'https://cobalt-api.lule.io',
  'https://api.wuk.sh',
  'https://api.cobalt.tools' // Thường bị giới hạn rate-limit nhưng giữ lại cuối cùng
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

          if (data.hdplay) {
            downloads.push({ label: 'Video HD (Không Logo)', url: formatTikWMUrl(data.hdplay), quality: 'HD' });
          }
          if (data.play) {
            downloads.push({ label: 'Video SD (Không Logo)', url: formatTikWMUrl(data.play), quality: 'SD' });
          }
          if (data.wmplay) {
            downloads.push({ label: 'Video (Có Logo)', url: formatTikWMUrl(data.wmplay), quality: 'Watermark' });
          }
          if (data.music) {
            downloads.push({ label: 'Nhạc Nền MP3 (Audio)', url: formatTikWMUrl(data.music), quality: 'Audio' });
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
          },
          body: JSON.stringify({
            url: url,
            videoQuality: quality,
            audioFormat: 'mp3',
            filenamePattern: 'basic',
            downloadMode: 'auto',
            youtubeVideoCodec: 'h264' // Hỗ trợ codec h264 tốt hơn cho các trình duyệt di động
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

          if (data.status === 'picker' && Array.isArray(data.picker)) {
            // Trường hợp tải nhiều ảnh/video (ví dụ: Instagram Slide)
            data.picker.forEach((item, index) => {
              downloads.push({
                label: `Mục ${index + 1} (${item.type === 'photo' ? 'Ảnh' : 'Video'})`,
                url: item.url,
                quality: 'Default'
              });
            });
          } else if (data.url) {
            // Tải đơn lẻ
            downloads.push({
              label: platform === 'youtube' ? `Tải Video (${quality}p)` : 'Tải Video / Media',
              url: data.url,
              quality: quality
            });
            
            // Nếu là YouTube, thêm tuỳ chọn tải Audio MP3
            if (platform === 'youtube') {
              // Gửi thêm một request phụ ngầm để lấy link MP3 nếu có thể, 
              // nhưng để tối ưu thời gian phản hồi, ta sẽ trả về link video trước.
            }
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
