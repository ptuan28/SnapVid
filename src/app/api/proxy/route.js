import { NextResponse } from 'next/server';

export async function GET(request) {
  let targetUrl = '';
  try {
    const { searchParams } = new URL(request.url);
    targetUrl = searchParams.get('url');
    let filename = searchParams.get('filename') || 'video.mp4';

    if (!targetUrl) {
      return new Response('Thiếu tham số URL!', { status: 400 });
    }

    // Thử tải tệp tin và pipe trực tiếp về client
    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
      signal: AbortSignal.timeout(20000) // 20 giây timeout
    });

    if (!response.ok) {
      throw new Error(`Máy chủ CDN trả về mã lỗi ${response.status}`);
    }

    // Lấy kiểu nội dung (contentType)
    const contentType = response.headers.get('content-type') || 'video/mp4';

    // Tạo header tải xuống bắt buộc
    const headers = new Headers();
    
    // Chuẩn hoá tiêu đề để trình duyệt nhận diện tải xuống trực tiếp
    headers.set('Content-Disposition', `attachment; filename*=UTF-8''${encodeURIComponent(filename)}`);
    headers.set('Content-Type', contentType);
    
    const contentLength = response.headers.get('content-length');
    if (contentLength) {
      headers.set('Content-Length', contentLength);
    }

    // Trả về Stream dữ liệu trực tiếp để tránh tải hết vào RAM (bypass payload limits)
    return new Response(response.body, {
      status: 200,
      headers
    });

  } catch (error) {
    console.error('Lỗi Proxy tải xuống, chuyển hướng sang link gốc:', error.message);
    
    // Phương án dự phòng (fallback): Nếu proxy lỗi hoặc timeout, tự động chuyển hướng người dùng đến liên kết trực tiếp
    if (targetUrl) {
      return NextResponse.redirect(targetUrl);
    }
    return new Response('Không thể tải tệp tin này.', { status: 500 });
  }
}
