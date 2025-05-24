import { eq } from "drizzle-orm";
import { db } from "../lib/db";
import { users } from "../lib/db/schema";
import { getUsers } from "../lib/db/queries/users";
import { readConfig } from "../config";
import { createFeed } from "../lib/db/queries/feeds";
import { type User, type Feed } from "../lib/db/types";
import { createFeedFollow } from "../lib/db/queries/follows";

function printFeed(feed: Feed, user: User) {
  console.log("--- User: ---");
  console.log(`ID: ${user.id}`);
  console.log(`Name: ${user.name}`);
  console.log("--- Feed ---");
  console.log(`ID: ${feed.id}`);
  console.log(`Name: ${feed.name}`);
  console.log(`URL: ${feed.url}`);
  console.log(`User ID: ${feed.user_id}`);
}

export async function handlerAddfeed(
  cmdName: string,
  user: User,
  ...args: string[]
) {
  if (!args.length) {
    throw Error("must provide argument <name>");
  }
  if (args.length !== 2) {
    throw Error("Usage: addfeed <name> <url>");
  }

  const config = readConfig();

  const [name, url] = args;

  const feed = await createFeed(name, url, user.id);
  const feedFollow = await createFeedFollow(user.id, feed.id);
  printFeed(feed, user);
}
