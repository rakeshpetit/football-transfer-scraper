import { ChatOpenAI } from "@langchain/openai";
import dotenv from "dotenv";

dotenv.config();

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_BASE_URL = process.env.OPENROUTER_BASE_URL;

const openRouterLlm = new ChatOpenAI(
  {
    modelName: "meta-llama/llama-3.1-8b-instruct",
    temperature: 0.1,
    openAIApiKey: OPENROUTER_API_KEY,
  },
  {
    basePath: `${OPENROUTER_BASE_URL}/api/v1`,
    baseOptions: {
      headers: {
        "HTTP-Referer": "https://localhost:3000/",
        "X-Title": "Transfers test",
      },
    },
  }
);

export { openRouterLlm };
