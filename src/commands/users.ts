import { readConfig } from "../config";
import { getUsers } from "../lib/db/queries/users";

export async function handlerUsers(cmdName: string, ...args: string[]) {
  const currentUser = readConfig().currentUserName;

  const users = await getUsers();
  for (const user of users) {
    console.log(
      `* ${user.name}${user.name === currentUser ? " (current)" : ""}`,
    );
  }
}
