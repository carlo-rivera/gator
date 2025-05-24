import { setUser } from "../config";
import { getUser } from "../lib/db/queries/users";

export async function handlerLogin(cmdName: string, ...args: string[]) {
  if (!args.length) {
    throw Error("must provide argument <username>");
  }
  if (args.length !== 1) {
    throw Error("Usage: login <username>");
  }

  const [username] = args;

  const user = await getUser(username);
  if (!user) {
    throw Error(`user ${username} doesn't exist`);
  }

  setUser(username);
  console.log(`User set to ${username}`);
}
