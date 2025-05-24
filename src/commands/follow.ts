import { readConfig } from "../config";
import { db } from "../lib/db";
import { createFeedFollow } from "../lib/db/queries/follows";
import { getUsers } from "../lib/db/queries/users";
import { feeds, users } from "../lib/db/schema";
import { eq } from "drizzle-orm";
import { User } from "../lib/db/types";

export async function handlerFollow(
  cmdName: string,
  user: User,
  ...args: string[]
) {
  if (!args.length) {
    throw Error("must provide argument <url>");
  }
  if (args.length !== 1) {
    throw Error("Usage: follow <url>");
  }

  const [url] = args;

  const currentUsername = readConfig().currentUserName;
  const [feed] = await db
    .select({ id: feeds.id })
    .from(feeds)
    .where(eq(feeds.url, url));

  const feedFollowInfo = await createFeedFollow(user.id, feed.id);

  console.log("Followed feed!");
  console.log(`Feed Name: ${feedFollowInfo.feedName}`);
  console.log(`User Name: ${feedFollowInfo.userName}`);
}
