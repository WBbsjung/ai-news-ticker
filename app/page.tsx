'use client';

import { useState, useEffect, useRef } from 'react';
import { translateHeadline } from '@/lib/translator';

interface NewsItem {
  title: string;
  link: string;
  pubDate?: string;
  contentSnippet?: string;
  source?: string;
  titleKo?: string;
}

export default function NewsTicker() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<string>('');
  const intervalRef = useRef<NodeJS.Timeout>();

  const fetchNews = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('Fetching news from API...');
      const response = await fetch('/api/news');

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch news');
      }

      if (!data.news || data.news.length === 0) {
        throw new Error('No news items available');
      }

      console.log(`✅ Fetched ${data.news.length} news items`);

      console.log('🔄 Translating news...');
      const translatedNews = await Promise.all(
        data.news.map(async (item) => {
          const translated = await translateHeadline(item.title);
          return {
            ...item,
            titleKo: translated,
          };
        })
      );
      console.log(`✅ Translated ${translatedNews.length} items`);

      setNews(translatedNews);
      setLastUpdate(new Date().toLocaleTimeString('ko-KR'));
      setError(null);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      console.error('❌ Error fetching news:', errorMsg);
      setError(errorMsg);

      if (news.length === 0) {
        setNews(getSampleNews());
      }
    } finally {
      setLoading(false);
    }
  };

  const getSampleNews = (): NewsItem[] => [
    {
      title: 'Loading real-time news...',
      titleKo: '실시간 뉴스 로딩 중...',
      link: '#',
      contentSnippet: 'Fetching news from RSS feeds. Please wait.',
      source: 'System',
    },
    {
      title: 'Click refresh to retry',
      titleKo: '새로고침을 눌러주세요',
      link: '#',
      contentSnippet: 'Click refresh button to reload news manually.',
      source: 'System',
    },
  ];

  useEffect(() => {
    fetchNews();
  }, []);

  useEffect(() => {
    intervalRef.current = setInterval(fetchNews, 180000);
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const tickerInterval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % Math.max(news.length, 1));
    }, 5000);
    return () => clearInterval(tickerInterval);
  }, [news]);

  const currentNews = news[currentIndex];

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 p-8">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-2 drop-shadow-lg">
            🤖 AI News Ticker
          </h1>
          <p className="text-gray-300 text-lg">
            실시간 AI 뉴스 헤드라인
          </p>
          {lastUpdate && (
            <p className="text-gray-400 text-sm mt-2">
              마지막 업데이트: {lastUpdate}
            </p>
          )}
          {error && (
            <div className="mt-4 bg-red-500/20 border border-red-500 rounded-lg p-4">
              <p className="text-red-300 text-sm">
                ⚠️ 뉴스 로딩 오류: {error}
              </p>
            </div>
          )}
        </header>

        {loading && news.length === 0 ? (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white"></div>
            <p className="text-white text-xl mt-4">뉴스를 불러오는 중...</p>
          </div>
        ) : currentNews ? (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 mb-8 shadow-2xl border border-white/20 transition-all duration-500 hover:scale-105">
            <h2 className="text-4xl font-bold text-white mb-3 leading-tight">
              {currentNews.titleKo || currentNews.title}
            </h2>
            {currentNews.titleKo !== currentNews.title && (
              <p className="text-gray-400 text-sm mb-4 italic">
                원문: {currentNews.title}
              </p>
            )}
            {currentNews.source && (
              <p className="text-gray-400 text-sm mb-2">
                📰 {currentNews.source}
              </p>
            )}
            {currentNews.contentSnippet && (
              <p className="text-gray-200 text-lg mb-4">
                {currentNews.contentSnippet}
              </p>
            )}
            <div className="flex justify-between items-center">
              <a
                href={currentNews.link}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                자세히 보기 →
              </a>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                <span className="text-gray-300 text-sm">
                  {currentIndex + 1} / {news.length}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-center">
            <p className="text-white text-xl mb-4">뉴스를 불러올 수 없습니다</p>
            <button
              onClick={fetchNews}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold"
            >
              다시 시도
            </button>
          </div>
        )}

        {news.length > 0 && (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-2xl border border-white/20">
            <h3 className="text-2xl font-bold text-white mb-4">📰 전체 뉴스 ({news.length}개)</h3>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {news.map((item, index) => (
                <div
                  key={`${item.link}-${index}`}
                  className={`p-4 rounded-lg transition-all cursor-pointer hover:bg-white/20 ${
                    index === currentIndex ? 'bg-blue-600/50 border-l-4 border-blue-400' : 'bg-white/5'
                  }`}
                  onClick={() => setCurrentIndex(index)}
                >
                  <h4 className="text-white font-semibold mb-1">
                    {item.titleKo || item.title}
                  </h4>
                  {item.titleKo !== item.title && (
                    <p className="text-gray-400 text-xs mb-1 italic">
                      {item.title}
                    </p>
                  )}
                  {item.source && (
                    <p className="text-gray-400 text-xs mb-1">📰 {item.source}</p>
                  )}
                  {item.pubDate && (
                    <p className="text-gray-400 text-sm">
                      {new Date(item.pubDate).toLocaleDateString('ko-KR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="text-center mt-6">
          <button
            onClick={fetchNews}
            disabled={loading}
            className="bg-white/20 hover:bg-white/30 text-white px-8 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            🔄 새로고침
          </button>
        </div>

        <footer className="text-center mt-12 text-gray-400 text-sm">
          <p>RSS 피드에서 실시간으로 수집 (Hacker News, TechCrunch, MIT Technology Review, VentureBeat)</p>
          <p className="mt-2">🌐 MyMemory API로 한국어 자동 번역</p>
        </footer>
      </div>
    </main>
  );
}
