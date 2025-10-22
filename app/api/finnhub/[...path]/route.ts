declare global {
  var cachedSymbols: any[] | undefined;
}

// src/app/api/finnhub/[...path]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const finnhubApiKey = process.env.NEXT_FINNHUB_API_KEY!;
const finnhubBaseUrl =
  process.env.NEXT_FINNHUB_BASE_URL || 'https://finnhub.io/api/v1';

export async function GET(
  req: NextRequest,
  params: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params.params;
  const fullPath = path.join('/');
  const query = req.nextUrl.search;
  const url = `${finnhubBaseUrl}/${fullPath}${query}`;

  try {
    if (fullPath === 'stock/symbol') {
      if (!globalThis.cachedSymbols) {
        const response = await axios.get(url, {
          headers: { 'X-Finnhub-Token': finnhubApiKey },
        });
        globalThis.cachedSymbols = response.data;
      }

      const searchParams = req.nextUrl.searchParams;
      const limit = parseInt(searchParams.get('limit') || '20');
      const page = parseInt(searchParams.get('page') || '1');

      const dataJson = globalThis.cachedSymbols || [];

      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;

      const pagination = dataJson.slice(startIndex, endIndex);

      return NextResponse.json({
        data: pagination,
        total: dataJson.length,
        totalPages: Math.ceil(dataJson.length / limit),
        currentPage: page,
      });
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
