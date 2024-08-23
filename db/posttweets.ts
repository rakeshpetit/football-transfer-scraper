require("dotenv").config();

import fs from "fs";
import { TweetContentOutput } from "../src/types";

const output = fs.readFileSync("output.json", "utf-8");
const tweets: TweetContentOutput[] = JSON.parse(output);

console.log(tweets.length);
