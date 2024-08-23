type XAccount = {
  account: string;
  timeline: string;
};

type TweetContentOutput = {
  account: string;
  content: string[];
};

type Transfer = {
  player: string;
  clubFrom: string;
  clubTo: string;
  fee: string;
  confidence: number;
};

export { XAccount, TweetContentOutput, Transfer };
