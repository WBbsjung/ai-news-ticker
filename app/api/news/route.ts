import { NextResponse } from 'next/server';
import { fetchNewsFromRSS } from '@/lib/news-fetcher';

export const dynamic = 'force-dynamic';
export const revalidate = 0; // 캐싱 비활성화

export async function GET() {
  try {
    console.log('🔄 Fetching news...');
    const news = await fetchNewsFromRSS();

    return NextResponse.json(
      {
        success: true,
        news,
        count: news.length,
        timestamp: new Date().toISOString(),
      },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
          'Pragma': 'no-cache',
        },
      }
    );
  } catch (error) {
    console.error('❌ API Error:', error);

    // 에러 메시지 추출
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
        news: [],
        count: 0,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
