import { type CommandsRegistry, registerCommand, runCommand } from "./commands";
import { handlerAddfeed } from "./commands/addfeed";
import { handlerAgg } from "./commands/agg";
import { handlerBrowse } from "./commands/browse";
import { handlerFeeds } from "./commands/feeds";
import { handlerFollow } from "./commands/follow";
import { handlerFollowing } from "./commands/following";
import { handlerLogin } from "./commands/login";
import { handlerRegister } from "./commands/register";
import { handlerReset } from "./commands/reset";
import { handlerUnfollow } from "./commands/unfollow";
import { handlerUsers } from "./commands/users";
import { middlewareLoggedIn } from "./middleware";

async function main() {
  const args = process.argv.slice(2);

  if (!args.length) {
    console.log("usage: cli <command> [args...]");
    process.exit(1);
  }

  const [cmdName, ...cmdArgs] = args;
  const registry: CommandsRegistry = {};
  registerCommand(registry, "login", handlerLogin);
  registerCommand(registry, "register", handlerRegister);
  registerCommand(registry, "reset", handlerReset);
  registerCommand(registry, "users", handlerUsers);
  registerCommand(registry, "agg", handlerAgg);
  registerCommand(registry, "addfeed", middlewareLoggedIn(handlerAddfeed));
  registerCommand(registry, "feeds", handlerFeeds);
  registerCommand(registry, "follow", middlewareLoggedIn(handlerFollow));
  registerCommand(registry, "following", middlewareLoggedIn(handlerFollowing));
  registerCommand(registry, "unfollow", middlewareLoggedIn(handlerUnfollow));
  registerCommand(registry, "browse", middlewareLoggedIn(handlerBrowse));

  try {
    await runCommand(registry, cmdName, ...cmdArgs);
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.log(`error running command ${cmdName}: ${err.message}`);
    } else {
      console.log(`error running command ${cmdName}, ${err}!`);
    }
    process.exit(1);
  }

  process.exit(0);
}

main();
