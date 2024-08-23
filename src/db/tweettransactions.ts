import dotenv from "dotenv";

dotenv.config();

import { supabase } from "./client";
import { Transfer } from "../types";

export const fetchTransferTweets = async () => {
  // Select first 10 rows
  const { data, error } = await supabase
    .from("transfer_tweets")
    .select("*")
    .or("parsed.eq.false,parsed.is.null")
    .limit(10);
  if (error) {
    console.error("Error fetching transfer tweets:", error);
  }
  console.log("Fetched transfer tweets:", data);
  return data;
};

export const setParsed = async (tweetId: number) => {
  const { data, error } = await supabase
    .from("transfer_tweets")
    .update({ parsed: true })
    .eq("id", tweetId);
  if (error) {
    console.error("Error setting parsed:", error);
  }
  return data;
};

export const addTransfer = async (
  { player, clubFrom, clubTo, fee, confidence }: Transfer,
  tweetId: number
) => {
  const { data, error } = await supabase.from("transfers").insert([
    {
      player,
      club_from: clubFrom,
      club_to: clubTo,
      fee,
      confidence,
      transfer_tweet_id: tweetId,
    },
  ]);
  if (!error) {
    await setParsed(tweetId);
  } else if (error) {
    console.error("Error adding transfer:", error);
  }
  return data;
};
