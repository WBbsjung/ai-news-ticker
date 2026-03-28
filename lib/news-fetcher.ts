import Parser from 'rss-parser';

const parser = new Parser();

export interface NewsItem {
  title: string;
  link: string;
  pubDate?: string;
  contentSnippet?: string;
  source?: string;
}

// 안정적인 RSS 피드 소스들
const RSS_FEEDS = [
  {
    name: 'Hacker News',
    url: 'https://news.ycombinator.com/rss',
  },
  {
    name: 'TechCrunch AI',
    url: 'https://techcrunch.com/category/artificial-intelligence/feed/',
  },
  {
    name: 'MIT Technology Review AI',
    url: 'https://www.technologyreview.com/topic/artificial-intelligence/feed/',
  },
  {
    name: 'VentureBeat AI',
    url: 'https://venturebeat.com/category/ai/feed/',
  },
];

export async function fetchNewsFromRSS(): Promise<NewsItem[]> {
  const allNews: NewsItem[] = [];
  const errors: string[] = [];

  for (const feedConfig of RSS_FEEDS) {
    try {
      const parsedFeed = await parser.parseURL(feedConfig.url);

      if (!parsedFeed.items || parsedFeed.items.length === 0) {
        console.log(`No items found in ${feedConfig.name}`);
        continue;
      }

      const items = parsedFeed.items.map(item => ({
        title: item.title || '',
        link: item.link || '',
        pubDate: item.pubDate || item.isoDate,
        contentSnippet: item.contentSnippet || item.content?.slice(0, 200) || '',
        source: feedConfig.name,
      }));

      console.log(`✅ ${feedConfig.name}: ${items.length} items fetched`);
      allNews.push(...items);
    } catch (error) {
      const errorMsg = `Error fetching ${feedConfig.name}: ${error instanceof Error ? error.message : String(error)}`;
      console.error(errorMsg);
      errors.push(errorMsg);
    }
  }

  if (allNews.length === 0) {
    console.error('❌ No news items fetched. Errors:', errors);
    throw new Error(`Failed to fetch news from any source. Errors: ${errors.join('; ')}`);
  }

  console.log(`📊 Total items fetched: ${allNews.length}`);

  // 최신 뉴스 순으로 정렬 (최대 30개)
  return allNews
    .sort((a, b) => {
      const dateA = a.pubDate ? new Date(a.pubDate).getTime() : 0;
      const dateB = b.pubDate ? new Date(b.pubDate).getTime() : 0;
      return dateB - dateA;
    })
    .slice(0, 30);
}
