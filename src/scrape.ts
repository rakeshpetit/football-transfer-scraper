import { chromium } from "playwright";

(async () => {
  const response = await fetch("http://localhost:9222/json/version");
  const json = await response.json();
  const wsEndpoint = json.webSocketDebuggerUrl;

  // Connect to the existing browser instance
  const browser = await chromium.connectOverCDP({ wsEndpoint });

  const context = await browser.contexts()[0];
  const page = await context.newPage();

  await page.waitForLoadState("domcontentloaded");

  const accounts: string[] = ["FabrizioRomano"];

  for (const account of accounts) {
    const url = `https://twitter.com/${account}`;
    await page.goto(url);
    console.log(`Visited ${url}`);

    // Wait for the tweets to load
    await page.waitForSelector('article[data-testid="tweet"]');

    // Extract tweet information
    const tweets = await page.$$eval(
      'article[data-testid="tweet"]',
      (elements) => {
        return elements.map((element) => {
          const username =
            element
              .querySelector('div[data-testid="User-Names"]')
              ?.textContent?.trim() || "";
          const content =
            element
              .querySelector('div[data-testid="tweetText"]')
              ?.textContent?.trim() || "";
          const timestamp =
            element.querySelector("time")?.getAttribute("datetime") || "";

          return { username, content, timestamp };
        });
      }
    );

    // Log the extracted tweets
    console.log(`Tweets from ${account}:`, tweets);
  }

  await browser.close();
})();
