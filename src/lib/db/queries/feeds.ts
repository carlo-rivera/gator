import { eq, sql } from "drizzle-orm";
import { db } from "..";
import { feeds } from "../schema";
import { readConfig } from "../../../config";
import { fetchFeed } from "../../../rss";
import { createPost } from "./posts";

export async function createFeed(name: string, url: string, userId: string) {
  const [result] = await db
    .insert(feeds)
    .values({ name: name, url: url, user_id: userId })
    .returning();
  return result;
}

export async function getFeeds() {
  const allFeeds = await db.select().from(feeds);
  return allFeeds;
}

export async function markFeedFetched(feedId: string) {
  await db
    .update(feeds)
    .set({
      lastFetchedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(feeds.id, feedId));
}

export async function getNextFeedToFetch() {
  const [feedToFetch] = await db
    .select()
    .from(feeds)
    .orderBy(sql`last_fetched_at ASC NULLS FIRST`);

  return feedToFetch;
}

export async function scrapeFeeds() {
  const nextFeed = await getNextFeedToFetch();
  console.log(`url1: ${nextFeed.url}, id1: ${nextFeed.id}`);
  await markFeedFetched(nextFeed.id);
  const rssCon = await fetchFeed(nextFeed.url);
  for (let item of rssCon.channel.item) {
    console.log(`url2: ${nextFeed.url}, id2: ${nextFeed.id}`);
    await createPost(
      nextFeed.id,
      item.title,
      item.link,
      item.description,
      new Date(item.pubDate),
    );
    console.log(`Added '${item.title}'`);
  }
}
