import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

interface CachedResponse {
  data: any;
  timestamp: number;
}
declare global {
  var finnhubCache: Map<string, CachedResponse> | undefined;
}

if (!globalThis.finnhubCache) {
  globalThis.finnhubCache = new Map<string, CachedResponse>();
}

const CACHE_TTL_MS = 300000;

const finnhubApiKey = process.env.NEXT_FINNHUB_API_KEY!;
const finnhubBaseUrl =
  process.env.NEXT_FINNHUB_BASE_URL || 'https://finnhub.io/api/v1';

export async function GET(
  req: NextRequest,
  context: { params: { path: string[] } }
) {
  const { path } = await context.params;
  const fullPath = path.join('/');
  const query = req.nextUrl.search;
  const url = `${finnhubBaseUrl}/${fullPath}${query}`;

  const isPaginatedSymbolEndpoint = fullPath === 'stock/symbol';

  const cacheKey = isPaginatedSymbolEndpoint ? fullPath : fullPath + query;

  const cache = globalThis.finnhubCache;

  try {
    // === 2. KIỂM TRA CACHE ===
    const cachedItem = cache?.get(cacheKey);
    const now = Date.now();
    let dataToUse: any;

    if (cachedItem && now - cachedItem.timestamp < CACHE_TTL_MS) {
      console.log(`[CACHE HIT] Using cached data for key: ${cacheKey}`);
      dataToUse = cachedItem.data;
    } else {
      console.log(`[CACHE MISS] Fetching data for key: ${cacheKey}`);

      const response = await axios.get(url, {
        headers: { 'X-Finnhub-Token': finnhubApiKey },
      });
      dataToUse = response.data;

      cache?.set(cacheKey, {
        data: dataToUse,
        timestamp: now,
      });
      console.log(`[CACHE STORED] Data cached for key: ${cacheKey}`);
    }

    if (isPaginatedSymbolEndpoint) {
      const searchParams = req.nextUrl.searchParams;
      const limit = parseInt(searchParams.get('limit') || '20');
      const page = parseInt(searchParams.get('page') || '1');
      const dataJson = Array.isArray(dataToUse) ? dataToUse : [];

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

    return NextResponse.json(dataToUse);
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to fetch data from Finnhub' },
      { status: error.response?.status || 500 }
    );
  }
}
