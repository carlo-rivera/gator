import { eq } from "drizzle-orm";
import { db } from "..";
import { users } from "../schema";

export async function createUser(name: string) {
  const [result] = await db.insert(users).values({ name: name }).returning();
  return result;
}

export async function getUser(name: string) {
  const results = await db.select().from(users).where(eq(users.name, name));
  if (!results.length) {
    return undefined;
  }
  return results[0];
}

export async function getUsers() {
  const allUsers = await db.select().from(users);
  return allUsers;
}

export async function resetUsers() {
  await db.delete(users);
}
