import { desc } from "drizzle-orm";
import { XMLParser } from "fast-xml-parser";

type RSSFeed = {
  channel: {
    title: string;
    link: string;
    description: string;
    item: RSSItem[];
  };
};

type RSSItem = {
  title: string;
  link: string;
  description: string;
  pubDate: string;
};

export async function fetchFeed(feedURL: string) {
  const response = await fetch(feedURL, {
    headers: {
      "User-Agent": "gator",
      accept: "application/rss+xml",
    },
  });
  if (!response.ok) {
    throw new Error(
      `failed to fetch feed: ${response.status} ${response.statusText}`,
    );
  }

  const rawText = await response.text();

  const parser = new XMLParser();
  const xmlObj = parser.parse(rawText);

  const channel = xmlObj.rss?.channel;
  if (!channel) {
    throw Error("failed to parse 'channel' property!");
  }

  const title = channel.title;
  if (!title) {
    throw Error("invalid rss feed - missing 'title'!");
  }
  const link = channel.link;
  if (!link) {
    throw Error("invalid rss feed - missing 'link'!");
  }
  const description = channel.description;
  if (!description) {
    throw Error("invalid rss feed - missing 'description'!");
  }

  let items = channel.item;
  if (!Array.isArray(items)) {
    items = [channel.item];
  }

  const rssItems: RSSItem[] = [];

  for (const item of items) {
    const title = item.title;
    const link = item.link;
    const description = item.description;
    const pubDate = item.pubDate;
    if (!title || !link || !description || !pubDate) continue;

    rssItems.push({ title, link, description, pubDate });
  }

  const feed: RSSFeed = {
    channel: {
      title: title,
      link: link,
      description: description,
      item: rssItems,
    },
  };

  return feed;
}
