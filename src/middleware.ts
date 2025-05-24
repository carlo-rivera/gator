import { readConfig } from "./config";
import { getUser } from "./lib/db/queries/users";
import { User } from "./lib/db/types";

type UserCommandHandler = (
  cmdName: string,
  user: User,
  ...args: string[]
) => Promise<void>;

export function middlewareLoggedIn(handler: UserCommandHandler) {
  return async (cmdName: string, ...args: string[]) => {
    const username = readConfig().currentUserName;
    const user = await getUser(username);
    if (!user) {
      throw new Error(`User ${username} not found`);
    }
    await handler(cmdName, user, ...args);
  };
}
