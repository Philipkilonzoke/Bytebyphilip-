// RSS feed fetching and merging with Firestore articles
const RSS_FEEDS = [
    { url: 'https://news.google.com/rss/search?q=technology&hl=en-US&gl=US&ceid=US:en', category: 'tech' },
    { url: 'https://news.google.com/rss/search?q=artificial+intelligence&hl=en-US&gl=US&ceid=US:en', category: 'ai' },
    { url: 'https://news.google.com/rss/search?q=machine+learning&hl=en-US&gl=US&ceid=US:en', category: 'ai' },
    { url: 'https://news.google.com/rss/search?q=programming&hl=en-US&gl=US&ceid=US:en', category: 'programming' },
    { url: 'https://news.google.com/rss/search?q=cybersecurity&hl=en-US&gl=US&ceid=US:en', category: 'security' },
    { url: 'https://news.google.com/rss/search?q=tech+gadgets&hl=en-US&gl=US&ceid=US:en', category: 'gadgets' }
];

export async function fetchAllRSSFeeds() {
    const allItems = [];
    
    for (const feed of RSS_FEEDS) {
        try {
            const items = await fetchRSSFeed(feed.url, feed.category);
            allItems.push(...items);
        } catch (error) {
            console.error(`Error fetching RSS feed ${feed.url}:`, error);
        }
    }

    return deduplicateItems(allItems);
}

async function fetchRSSFeed(feedUrl, category) {
    try {
        // Use RSS2JSON API as a CORS proxy
        const proxyUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feedUrl)}&api_key=YOUR_API_KEY&count=20`;
        
        const response = await fetch(proxyUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.status !== 'ok') {
            throw new Error('RSS feed fetch failed');
        }

        return data.items.map(item => ({
            title: item.title,
            link: item.link,
            pubDate: item.pubDate,
            publishedAt: item.pubDate,
            excerpt: item.description?.replace(/<[^>]*>/g, '').substring(0, 200) || '',
            summary: item.description?.replace(/<[^>]*>/g, '').substring(0, 200) || '',
            image: extractImage(item) || 'assets/default-news.jpg',
            source: 'Google News',
            category: category,
            isExternal: true
        }));
    } catch (error) {
        console.error(`Error fetching RSS feed: ${error.message}`);
        // Fallback to direct fetch if proxy fails
        return fetchRSSDirectly(feedUrl, category);
    }
}

async function fetchRSSDirectly(feedUrl, category) {
    try {
        const response = await fetch(feedUrl);
        if (!response.ok) throw new Error('Direct fetch failed');
        
        const text = await response.text();
        const parser = new DOMParser();
        const xml = parser.parseFromString(text, 'text/xml');
        
        const items = xml.querySelectorAll('item');
        return Array.from(items).slice(0, 20).map(item => ({
            title: item.querySelector('title')?.textContent || 'No title',
            link: item.querySelector('link')?.textContent || '#',
            pubDate: item.querySelector('pubDate')?.textContent || new Date().toISOString(),
            publishedAt: item.querySelector('pubDate')?.textContent || new Date().toISOString(),
            excerpt: (item.querySelector('description')?.textContent || '').replace(/<[^>]*>/g, '').substring(0, 200),
            summary: (item.querySelector('description')?.textContent || '').replace(/<[^>]*>/g, '').substring(0, 200),
            image: extractImageFromXML(item) || 'assets/default-news.jpg',
            source: 'Google News',
            category: category,
            isExternal: true
        }));
    } catch (error) {
        console.error(`Direct RSS fetch failed: ${error.message}`);
        return getFallbackNews(category);
    }
}

function extractImage(item) {
    // Try to extract image from various fields
    if (item.enclosure && item.enclosure.link) {
        return item.enclosure.link;
    }
    if (item.thumbnail) {
        return item.thumbnail;
    }
    // Try to extract from description
    const match = item.description?.match(/<img[^>]+src="([^">]+)"/);
    if (match) {
        return match[1];
    }
    return null;
}

function extractImageFromXML(item) {
    const enclosure = item.querySelector('enclosure');
    if (enclosure) {
        return enclosure.getAttribute('url');
    }
    
    const mediaContent = item.querySelector('media\\:content, content');
    if (mediaContent) {
        return mediaContent.getAttribute('url');
    }
    
    const description = item.querySelector('description')?.textContent || '';
    const match = description.match(/<img[^>]+src="([^">]+)"/);
    if (match) {
        return match[1];
    }
    
    return null;
}

function deduplicateItems(items) {
    const seen = new Set();
    return items.filter(item => {
        const key = item.title.toLowerCase().substring(0, 50);
        if (seen.has(key)) {
            return false;
        }
        seen.add(key);
        return true;
    });
}

function getFallbackNews(category) {
    const fallbackItems = [
        {
            title: 'Latest developments in AI technology continue to transform industries',
            link: '#',
            pubDate: new Date().toISOString(),
            publishedAt: new Date().toISOString(),
            excerpt: 'Artificial intelligence is reshaping how businesses operate across various sectors.',
            summary: 'Artificial intelligence is reshaping how businesses operate across various sectors.',
            image: 'assets/default-news.jpg',
            source: 'Tech News',
            category: category,
            isExternal: true
        },
        {
            title: 'Cybersecurity threats evolve as digital transformation accelerates',
            link: '#',
            pubDate: new Date().toISOString(),
            publishedAt: new Date().toISOString(),
            excerpt: 'Organizations face new challenges in protecting data and systems from cyber attacks.',
            summary: 'Organizations face new challenges in protecting data and systems from cyber attacks.',
            image: 'assets/default-news.jpg',
            source: 'Security News',
            category: category,
            isExternal: true
        },
        {
            title: 'New programming frameworks promise faster development cycles',
            link: '#',
            pubDate: new Date().toISOString(),
            publishedAt: new Date().toISOString(),
            excerpt: 'Modern tools are making it easier for developers to build complex applications.',
            summary: 'Modern tools are making it easier for developers to build complex applications.',
            image: 'assets/default-news.jpg',
            source: 'Dev News',
            category: category,
            isExternal: true
        }
    ];
    
    return fallbackItems.filter(item => item.category === category);
}

export async function refreshRSSFeeds() {
    const items = await fetchAllRSSFeeds();
    localStorage.setItem('cached_rss_items', JSON.stringify(items));
    localStorage.setItem('rss_last_fetch', Date.now().toString());
    return items;
}

export function getCachedRSSItems() {
    const cached = localStorage.getItem('cached_rss_items');
    const lastFetch = localStorage.getItem('rss_last_fetch');
    
    if (cached && lastFetch) {
        const age = Date.now() - parseInt(lastFetch);
        // Cache for 30 minutes
        if (age < 30 * 60 * 1000) {
            return JSON.parse(cached);
        }
    }
    
    return null;
}
