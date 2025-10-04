// RSS feed fetching and merging with Firestore articles
const RSS_FEEDS = [
    { url: 'https://news.google.com/rss/search?q=technology&hl=en-US&gl=US&ceid=US:en', category: 'tech' },
    { url: 'https://news.google.com/rss/search?q=artificial+intelligence&hl=en-US&gl=US&ceid=US:en', category: 'ai' },
    { url: 'https://news.google.com/rss/search?q=machine+learning&hl=en-US&gl=US&ceid=US:en', category: 'ai' },
    { url: 'https://news.google.com/rss/search?q=programming&hl=en-US&gl=US&ceid=US:en', category: 'programming' },
    { url: 'https://news.google.com/rss/search?q=cybersecurity&hl=en-US&gl=US&ceid=US:en', category: 'security' },
    { url: 'https://news.google.com/rss/search?q=tech+gadgets&hl=en-US&gl=US&ceid=US:en', category: 'gadgets' }
];

// Use AllOrigins as a free CORS proxy (no API key required)
const CORS_PROXY = 'https://api.allorigins.win/raw?url=';

export async function fetchAllRSSFeeds() {
    const allItems = [];
    
    // Try to fetch from each feed, but don't fail if one fails
    const feedPromises = RSS_FEEDS.map(feed => 
        fetchRSSFeed(feed.url, feed.category)
            .catch(error => {
                console.warn(`Failed to fetch ${feed.category} feed:`, error);
                return []; // Return empty array if feed fails
            })
    );

    const results = await Promise.all(feedPromises);
    results.forEach(items => allItems.push(...items));

    // If no RSS items loaded, return comprehensive fallback data
    if (allItems.length === 0) {
        console.log('No RSS feeds loaded, using fallback data');
        return getAllFallbackNews();
    }

    return deduplicateItems(allItems);
}

async function fetchRSSFeed(feedUrl, category) {
    try {
        // Try direct fetch first (may fail due to CORS)
        let response = await fetch(feedUrl);
        let text;
        
        if (!response.ok) {
            // Fallback to CORS proxy
            response = await fetch(CORS_PROXY + encodeURIComponent(feedUrl));
            if (!response.ok) {
                throw new Error(`Proxy fetch failed: ${response.status}`);
            }
        }
        
        text = await response.text();
        const parser = new DOMParser();
        const xml = parser.parseFromString(text, 'text/xml');
        
        // Check for parsing errors
        const parseError = xml.querySelector('parsererror');
        if (parseError) {
            throw new Error('XML parsing failed');
        }
        
        const items = xml.querySelectorAll('item');
        if (items.length === 0) {
            throw new Error('No items found in feed');
        }
        
        return Array.from(items).slice(0, 15).map(item => {
            const title = item.querySelector('title')?.textContent || 'No title';
            const link = item.querySelector('link')?.textContent || '#';
            const pubDate = item.querySelector('pubDate')?.textContent || new Date().toISOString();
            const description = item.querySelector('description')?.textContent || '';
            
            return {
                title: cleanText(title),
                link: link,
                pubDate: pubDate,
                publishedAt: pubDate,
                excerpt: cleanText(description).substring(0, 200),
                summary: cleanText(description).substring(0, 200),
                image: extractImageFromXML(item) || 'assets/default-news.jpg',
                source: 'Google News',
                category: category,
                isExternal: true
            };
        });
    } catch (error) {
        console.error(`Error fetching RSS feed (${category}):`, error.message);
        // Return category-specific fallback
        return getFallbackNews(category);
    }
}

function cleanText(text) {
    if (!text) return '';
    // Remove HTML tags and clean up
    return text
        .replace(/<[^>]*>/g, '')
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .trim();
}

function extractImageFromXML(item) {
    // Try various image sources
    const enclosure = item.querySelector('enclosure');
    if (enclosure && enclosure.getAttribute('type')?.startsWith('image')) {
        return enclosure.getAttribute('url');
    }
    
    const mediaContent = item.querySelector('media\\:content, content');
    if (mediaContent) {
        const url = mediaContent.getAttribute('url');
        if (url && (url.includes('.jpg') || url.includes('.png') || url.includes('.webp'))) {
            return url;
        }
    }
    
    const mediaThumbnail = item.querySelector('media\\:thumbnail, thumbnail');
    if (mediaThumbnail) {
        return mediaThumbnail.getAttribute('url');
    }
    
    const description = item.querySelector('description')?.textContent || '';
    const imgMatch = description.match(/<img[^>]+src="([^">]+)"/);
    if (imgMatch && imgMatch[1]) {
        return imgMatch[1];
    }
    
    return null;
}

function deduplicateItems(items) {
    const seen = new Set();
    return items.filter(item => {
        const key = item.title.toLowerCase().substring(0, 60).replace(/\s+/g, '');
        if (seen.has(key)) {
            return false;
        }
        seen.add(key);
        return true;
    });
}

function getFallbackNews(category) {
    const now = new Date();
    const yesterday = new Date(now - 24 * 60 * 60 * 1000);
    const twoDaysAgo = new Date(now - 2 * 24 * 60 * 60 * 1000);
    
    const fallbackByCategory = {
        tech: [
            {
                title: 'Latest Technology Trends Reshaping Industries in 2025',
                link: '#',
                pubDate: now.toISOString(),
                publishedAt: now.toISOString(),
                excerpt: 'Explore how emerging technologies are transforming businesses and creating new opportunities across various sectors.',
                summary: 'Explore how emerging technologies are transforming businesses and creating new opportunities across various sectors.',
                image: 'assets/default-news.jpg',
                source: 'Tech News',
                category: 'tech',
                isExternal: true
            },
            {
                title: 'Cloud Computing Advances Drive Digital Transformation',
                link: '#',
                pubDate: yesterday.toISOString(),
                publishedAt: yesterday.toISOString(),
                excerpt: 'New cloud services and infrastructure improvements are enabling faster innovation and scalability for businesses.',
                summary: 'New cloud services and infrastructure improvements are enabling faster innovation and scalability for businesses.',
                image: 'assets/default-news.jpg',
                source: 'Tech News',
                category: 'tech',
                isExternal: true
            }
        ],
        ai: [
            {
                title: 'Artificial Intelligence Breakthroughs in Natural Language Processing',
                link: '#',
                pubDate: now.toISOString(),
                publishedAt: now.toISOString(),
                excerpt: 'Recent advances in AI language models are pushing the boundaries of what machines can understand and generate.',
                summary: 'Recent advances in AI language models are pushing the boundaries of what machines can understand and generate.',
                image: 'assets/default-news.jpg',
                source: 'AI News',
                category: 'ai',
                isExternal: true
            },
            {
                title: 'Machine Learning Models Achieve Human-Level Performance in Complex Tasks',
                link: '#',
                pubDate: yesterday.toISOString(),
                publishedAt: yesterday.toISOString(),
                excerpt: 'New ML architectures demonstrate remarkable capabilities in pattern recognition and decision making.',
                summary: 'New ML architectures demonstrate remarkable capabilities in pattern recognition and decision making.',
                image: 'assets/default-news.jpg',
                source: 'AI News',
                category: 'ai',
                isExternal: true
            }
        ],
        programming: [
            {
                title: 'Modern Development Frameworks Simplify Complex Applications',
                link: '#',
                pubDate: now.toISOString(),
                publishedAt: now.toISOString(),
                excerpt: 'New tools and frameworks are making it easier for developers to build sophisticated applications faster.',
                summary: 'New tools and frameworks are making it easier for developers to build sophisticated applications faster.',
                image: 'assets/default-news.jpg',
                source: 'Dev News',
                category: 'programming',
                isExternal: true
            },
            {
                title: 'Open Source Projects Driving Innovation in Software Development',
                link: '#',
                pubDate: twoDaysAgo.toISOString(),
                publishedAt: twoDaysAgo.toISOString(),
                excerpt: 'Community-driven projects continue to shape the future of software development with collaborative innovations.',
                summary: 'Community-driven projects continue to shape the future of software development with collaborative innovations.',
                image: 'assets/default-news.jpg',
                source: 'Dev News',
                category: 'programming',
                isExternal: true
            }
        ],
        security: [
            {
                title: 'Cybersecurity Threats Evolve as Digital Transformation Accelerates',
                link: '#',
                pubDate: now.toISOString(),
                publishedAt: now.toISOString(),
                excerpt: 'Organizations face new challenges in protecting data and systems from increasingly sophisticated cyber attacks.',
                summary: 'Organizations face new challenges in protecting data and systems from increasingly sophisticated cyber attacks.',
                image: 'assets/default-news.jpg',
                source: 'Security News',
                category: 'security',
                isExternal: true
            },
            {
                title: 'Zero Trust Architecture Becomes Essential for Modern Security',
                link: '#',
                pubDate: yesterday.toISOString(),
                publishedAt: yesterday.toISOString(),
                excerpt: 'Companies are adopting zero trust principles to better protect against evolving security threats.',
                summary: 'Companies are adopting zero trust principles to better protect against evolving security threats.',
                image: 'assets/default-news.jpg',
                source: 'Security News',
                category: 'security',
                isExternal: true
            }
        ],
        gadgets: [
            {
                title: 'Latest Tech Gadgets Showcase Innovation in Consumer Electronics',
                link: '#',
                pubDate: now.toISOString(),
                publishedAt: now.toISOString(),
                excerpt: 'New devices and hardware innovations are bringing cutting-edge technology to everyday consumers.',
                summary: 'New devices and hardware innovations are bringing cutting-edge technology to everyday consumers.',
                image: 'assets/default-news.jpg',
                source: 'Gadget News',
                category: 'gadgets',
                isExternal: true
            },
            {
                title: 'Wearable Technology Advances Health and Fitness Tracking',
                link: '#',
                pubDate: yesterday.toISOString(),
                publishedAt: yesterday.toISOString(),
                excerpt: 'Smart devices are providing more accurate health monitoring and personalized fitness insights.',
                summary: 'Smart devices are providing more accurate health monitoring and personalized fitness insights.',
                image: 'assets/default-news.jpg',
                source: 'Gadget News',
                category: 'gadgets',
                isExternal: true
            }
        ]
    };
    
    return fallbackByCategory[category] || fallbackByCategory.tech;
}

function getAllFallbackNews() {
    return [
        ...getFallbackNews('tech'),
        ...getFallbackNews('ai'),
        ...getFallbackNews('programming'),
        ...getFallbackNews('security'),
        ...getFallbackNews('gadgets')
    ];
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
