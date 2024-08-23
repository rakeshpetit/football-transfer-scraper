import { addTransfer, fetchTransferTweets } from "../db/tweettransactions";
import { Transfer } from "../types";
import { informationParser } from "./parser";

async function fetchOutputFromLLM(input: string) {
  try {
    const response = await informationParser({
      phrase: input,
    });
    return response;
  } catch (err) {}
}

async function main() {
  const tweets = await fetchTransferTweets();
  if (tweets && tweets.length > 0) {
    console.log("Entries count:", tweets?.length);
    tweets.forEach(async (tweet) => {
      const response: Transfer = (await fetchOutputFromLLM(
        tweet.original_news
      )) as any;
      console.log("Processed tweet:", tweet.original_news);
      console.log(response);
      await addTransfer(response);
    });
  }
}

main();
