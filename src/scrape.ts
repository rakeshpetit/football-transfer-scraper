import fs from "fs";
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
    const url = `https://twitter.com/${account}/with_replies`;
    await page.goto(url);
    console.log(`Visited ${url}`);

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

    // Get HTML based on Aria label
    const ariaContent = await page.waitForSelector(
      '[aria-label="Home timeline"]'
    );

    const content = await ariaContent.innerHTML();

    // console.log(`Content`, content);
    if (content) {
      fs.writeFile("output.html", content, (err) => {
        if (err) {
          console.error("Error writing HTML file:", err);
        } else {
          console.log("HTML file has been saved successfully.");
        }
      });
    }

    console.log(`Tweets length`, tweets.length);
  }

  await browser.close();
})();
