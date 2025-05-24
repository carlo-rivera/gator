import { readConfig } from "../config";
import { db } from "../lib/db";
import { createFeedFollow, deleteFeedFollow } from "../lib/db/queries/follows";
import { getUsers } from "../lib/db/queries/users";
import { feeds, users } from "../lib/db/schema";
import { eq } from "drizzle-orm";
import { User } from "../lib/db/types";

export async function handlerUnfollow(
  cmdName: string,
  user: User,
  ...args: string[]
) {
  if (!args.length) {
    throw Error("must provide argument <url>");
  }
  if (args.length !== 1) {
    throw Error("Usage: unfollow <url>");
  }

  const [url] = args;

  await deleteFeedFollow(user, url);

  console.log("Deleted feed!");
}
