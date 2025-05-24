import { scrapeFeeds } from "../lib/db/queries/feeds.js";
import { fetchFeed } from "../rss.js";

export function parseDuration(durationStr: string) {
  const regex = /^(\d+)(ms|s|m|h)$/;
  const match = durationStr.match(regex);
  if (match) {
    const [input, number, unit] = match;
    let intNum = parseInt(number);
    switch (unit) {
      case "ms":
        return intNum;
      case "s":
        return intNum * 1000;
      case "m":
        return intNum * 1000 * 60;
      case "h":
        return intNum * 1000 * 60 * 60;
      default:
        throw Error("invalid duration string!");
    }
  } else {
    throw Error("invalid duration string!");
  }
}

export function handleError(error: unknown) {
  if (error instanceof Error) {
    console.log(`error while aggregating: ${error.message}`);
  } else {
    console.log(`error while aggregating: ${error}`);
  }
}

export async function handlerAgg(cmdName: string, ...args: string[]) {
  if (!args.length) {
    throw Error("must provide argument <time_between_reqs>");
  }
  if (args.length !== 1) {
    throw Error("Usage: agg <time_between_reqs>");
  }

  const [time_between_reqs] = args;
  const durationInMs = parseDuration(time_between_reqs);

  console.log(`Collecting feeds every ${time_between_reqs}`);

  scrapeFeeds().catch(handleError);

  const interval = setInterval(() => {
    scrapeFeeds().catch(handleError);
  }, durationInMs);

  await new Promise<void>((resolve) => {
    process.on("SIGINT", () => {
      console.log("shutting down..");
      clearInterval(interval);
      resolve();
    });
  });
}
