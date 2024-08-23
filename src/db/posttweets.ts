require("dotenv").config();

import fs from "fs";
import { TweetContentOutput } from "../types";
import { supabase } from "./client";

const output = fs.readFileSync("output.json", "utf-8");
const tweetAccounts: TweetContentOutput[] = JSON.parse(output);

async function main() {
  tweetAccounts.forEach(async ({ account, content }) => {
    content.forEach(async (tweetContent) => {
      const { statusText, error } = await supabase
        .from("transfer_tweets")
        .insert({
          account,
          original_news: tweetContent,
        });
      console.log(statusText, error);
    });
  });
}

main();
