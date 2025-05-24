import { readConfig } from "../config";
import { db } from "../lib/db";
import {
  createFeedFollow,
  getFeedFollowsForUser,
} from "../lib/db/queries/follows";
import { getUsers } from "../lib/db/queries/users";
import { feeds, users } from "../lib/db/schema";
import { eq } from "drizzle-orm";
import { User } from "../lib/db/types";

export async function handlerFollowing(
  cmdName: string,
  user: User,
  ...args: string[]
) {
  const currentUsername = readConfig().currentUserName;

  const feedFollows = await getFeedFollowsForUser(user.id);

  console.log("Feed follows:");
  for (const feedFollow of feedFollows) {
    console.log(feedFollow.feed);
  }
}
