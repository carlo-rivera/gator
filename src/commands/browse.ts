import { readConfig } from "../config";
import { db } from "../lib/db";
import { createFeedFollow, deleteFeedFollow } from "../lib/db/queries/follows";
import { getUsers } from "../lib/db/queries/users";
import { feeds, users } from "../lib/db/schema";
import { eq } from "drizzle-orm";
import { User } from "../lib/db/types";
import { getPostsForUser } from "../lib/db/queries/posts";

export async function handlerBrowse(
  cmdName: string,
  user: User,
  ...args: string[]
) {
  const limit = args[0] ?? 2;
  const posts = await getPostsForUser(user, parseInt(limit));
  for (let post of posts) {
    console.log(`${post.title}: ${post.description} at ${post.publishedAt}`);
  }
}
