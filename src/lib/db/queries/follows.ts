import { and, eq } from "drizzle-orm";
import { db } from "..";
import { feedFollows, feeds, users } from "../schema";
import { readConfig } from "../../../config";
import { User } from "../types";

export async function createFeedFollow(userId: string, feedId: string) {
  const [newFeedFollow] = await db
    .insert(feedFollows)
    .values({ user_id: userId, feed_id: feedId })
    .returning();

  const [feedFollowInfo] = await db
    .select({
      id: feedFollows.id,
      createdAt: feedFollows.createdAt,
      updatedAt: feedFollows.updatedAt,
      userName: users.name,
      feedName: feeds.name,
      userId: feedFollows.user_id,
      feedId: feedFollows.feed_id,
    })
    .from(feedFollows)
    .where(eq(feedFollows.id, newFeedFollow.id))
    .innerJoin(users, eq(feedFollows.user_id, users.id))
    .innerJoin(feeds, eq(feedFollows.feed_id, feeds.id));

  return feedFollowInfo;
}

export async function getFeedFollowsForUser(userId: string) {
  const feedFollowsForUser = await db
    .select({ feed: feeds.name, name: users.name })
    .from(feedFollows)
    .where(eq(feedFollows.user_id, userId))
    .innerJoin(users, eq(feedFollows.user_id, users.id))
    .innerJoin(feeds, eq(feedFollows.feed_id, feeds.id));

  return feedFollowsForUser;
}

export async function deleteFeedFollow(user: User, feedUrl: string) {
  const [feed] = await db
    .select({ id: feeds.id })
    .from(feeds)
    .where(eq(feeds.url, feedUrl));

  await db
    .delete(feedFollows)
    .where(
      and(eq(feedFollows.user_id, user.id), eq(feedFollows.feed_id, feed.id)),
    );
}
