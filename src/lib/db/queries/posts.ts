import { desc, eq, sql } from "drizzle-orm";
import { db } from "..";
import { feedFollows, feeds, posts } from "../schema";
import { readConfig } from "../../../config";
import { fetchFeed } from "../../../rss";
import { Feed, Post, User } from "../types";
import { getNextFeedToFetch } from "./feeds";

export async function createPost(
  feedId: string,
  title: string,
  link: string,
  description: string,
  pubDate: Date,
) {
  const [result] = await db
    .insert(posts)
    .values({
      feed_id: feedId,
      title: title,
      url: link,
      description: description,
      publishedAt: pubDate,
    })
    .returning();

  return result;
}

export async function getPostsForUser(user: User, numPosts: number) {
  const feedsFollowed = await db
    .select()
    .from(feedFollows)
    .where(eq(feedFollows.user_id, user.id));

  let allPosts: Post[] = [];

  for (let feed of feedsFollowed) {
    const postsInFeed = await db
      .select()
      .from(posts)
      .where(eq(posts.feed_id, feed.feed_id))
      .orderBy(desc(posts.publishedAt));

    allPosts.push(...postsInFeed);
  }

  const sortedPosts = allPosts.toSorted(
    (a, b) => b.publishedAt!.getTime() - a.publishedAt!.getTime(),
  );
  const finalPosts = sortedPosts.slice(0, numPosts);
  return finalPosts;
}
