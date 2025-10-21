// src/app/api/finnhub/[...path]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const finnhubApiKey = process.env.NEXT_FINNHUB_API_KEY!;
const finnhubBaseUrl =
  process.env.NEXT_FINNHUB_BASE_URL || 'https://finnhub.io/api/v1';

// 👇 Thêm khai báo này ngay đầu file
declare global {
  var cachedSymbols: any[] | undefined;
}

export async function GET(
  req: NextRequest,
  params: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params.params;
  const fullPath = path.join('/');
  const query = req.nextUrl.search;
  const url = `${finnhubBaseUrl}/${fullPath}${query}`;

  try {
    // Nếu là API lấy danh sách symbol (dữ liệu lớn)
    if (fullPath === 'stock/symbol') {
      // Cache để tránh gọi lại nhiều lần
      if (!globalThis.cachedSymbols) {
        const response = await axios.get(url, {
          headers: { 'X-Finnhub-Token': finnhubApiKey },
        });
        globalThis.cachedSymbols = response.data;
      }

      const symbols = globalThis.cachedSymbols;

      return NextResponse.json(symbols);
    }

    // Với các API khác (chi tiết)
    const response = await axios.get(url, {
      headers: { 'X-Finnhub-Token': finnhubApiKey },
    });
    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error('Finnhub API Error:', error.response?.data || error.message);
    return NextResponse.json(
      { error: 'Failed to fetch data from Finnhub' },
      { status: error.response?.status || 500 }
    );
  }
}
