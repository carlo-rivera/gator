import { setUser } from "../config";
import { createUser, getUser } from "../lib/db/queries/users";

export async function handlerRegister(cmdName: string, ...args: string[]) {
  if (!args.length) {
    throw Error("must provide argument <username>");
  }
  if (args.length !== 1) {
    throw Error("Usage: register <username>");
  }

  const [username] = args;
  if (await getUser(username)) {
    throw Error(`user ${username} already exists`);
  }
  const user = await createUser(username);
  setUser(username);
  console.log(`User ${username} created!`);
  console.log(user);
}
