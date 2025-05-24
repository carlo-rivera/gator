import { setUser } from "../config";
import { resetUsers } from "../lib/db/queries/users";

export async function handlerReset(cmdName: string, ...args: string[]) {
  await resetUsers();
  console.log("Table reset successfully");
}
