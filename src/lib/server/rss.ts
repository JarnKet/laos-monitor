export interface RssItem {
	title: string;
	link: string;
	pubDate: string; // ISO 8601
	description: string;
	categories: string[];
}

export interface RssFeed {
	title: string;
	items: RssItem[];
	fetchedAt: number;
}

// 5-minute cache
const cache = new Map<string, RssFeed>();
const CACHE_TTL = 5 * 60 * 1000;

function unwrapCdata(s: string): string {
	const m = s.match(/^<!\[CDATA\[([\s\S]*?)\]\]>$/);
	return m ? m[1] : s;
}

function decodeEntities(s: string): string {
	return s
		.replace(/&amp;/g, '&')
		.replace(/&lt;/g, '<')
		.replace(/&gt;/g, '>')
		.replace(/&quot;/g, '"')
		.replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
		.replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCharCode(parseInt(h, 16)));
}

function extractTag(xml: string, tag: string): string {
	const m = xml.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i'));
	return m ? decodeEntities(unwrapCdata(m[1].trim())) : '';
}

function extractAllTags(xml: string, tag: string): string[] {
	const results: string[] = [];
	const re = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'gi');
	let m: RegExpExecArray | null;
	while ((m = re.exec(xml)) !== null) {
		results.push(decodeEntities(unwrapCdata(m[1].trim())));
	}
	return results;
}

function parseRfc822(dateStr: string): string {
	// RFC 822 dates like "Mon, 03 Mar 2025 10:00:00 +0700"
	try {
		return new Date(dateStr).toISOString();
	} catch {
		return new Date().toISOString();
	}
}

function stripHtml(html: string): string {
	return html.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
}

function parseItems(xml: string, maxItems: number): RssItem[] {
	const items: RssItem[] = [];
	const re = /<item[^>]*>([\s\S]*?)<\/item>/gi;
	let m: RegExpExecArray | null;
	while ((m = re.exec(xml)) !== null && items.length < maxItems) {
		const itemXml = m[1];
		const rawDesc = extractTag(itemXml, 'description');
		items.push({
			title: extractTag(itemXml, 'title'),
			link: extractTag(itemXml, 'link') || extractTag(itemXml, 'guid'),
			pubDate: parseRfc822(extractTag(itemXml, 'pubDate')),
			description: stripHtml(rawDesc).slice(0, 200),
			categories: extractAllTags(itemXml, 'category'),
		});
	}
	return items;
}

export async function fetchRssFeed(url: string, maxItems = 20): Promise<RssFeed> {
	const cached = cache.get(url);
	if (cached && Date.now() - cached.fetchedAt < CACHE_TTL) return cached;

	const res = await fetch(url, {
		headers: { 'User-Agent': 'LaosMonitor/1.0' },
		signal: AbortSignal.timeout(8000),
	});
	if (!res.ok) throw new Error(`RSS fetch failed: ${res.status}`);
	const xml = await res.text();

	const feedTitle = extractTag(xml, 'title');
	const items = parseItems(xml, maxItems);

	const feed: RssFeed = { title: feedTitle, items, fetchedAt: Date.now() };
	cache.set(url, feed);
	return feed;
}
