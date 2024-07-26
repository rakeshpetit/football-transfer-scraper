import { chromium } from "playwright";

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  const accounts: string[] = ["FabrizioRomano"]; // List of Twitter accounts to visit

  for (const account of accounts) {
    const url = `https://twitter.com/${account}`;
    await page.goto(url);
    console.log(`Visited ${url}`);
    // You can add more code here to scrape data if needed
  }

  await browser.close();
})();
