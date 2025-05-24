import { eq } from "drizzle-orm";
import { setUser } from "../config";
import { db } from "../lib/db";
import { getFeeds } from "../lib/db/queries/feeds";
import { getUser } from "../lib/db/queries/users";
import { users } from "../lib/db/schema";
import { type User, type Feed } from "../lib/db/types";

function printFeed(feed: Feed, creatorName: string) {
  console.log("--- Feed ---");
  console.log(`Name: ${feed.name}`);
  console.log(`URL: ${feed.url}`);
  console.log(`Username: ${creatorName}`);
}

export async function handlerFeeds(cmdName: string, ...args: string[]) {
  const feeds = await getFeeds();
  for (const feed of feeds) {
    const [creator] = await db
      .select()
      .from(users)
      .where(eq(users.id, feed.user_id));
    printFeed(feed, creator.name);
  }
}
