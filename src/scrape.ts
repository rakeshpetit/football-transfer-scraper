import fs from "fs";
import { chromium, Page } from "playwright";
import { accounts } from "./accounts";

(async () => {
  const response = await fetch("http://localhost:9222/json/version");
  const json = await response.json();
  const wsEndpoint = json.webSocketDebuggerUrl;

  // Connect to the existing browser instance
  const browser = await chromium.connectOverCDP({ wsEndpoint });

  const context = await browser.contexts()[0];
  const page = await context.newPage();

  await page.waitForLoadState("domcontentloaded");

  const getTweets = async (page: Page) => {
    return await page.$$eval('article[data-testid="tweet"]', (elements) => {
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
    });
  };

  const writePageContent = async (
    account: string,
    page: Page,
    selector: string
  ) => {
    const ariaContent = await page.waitForSelector(selector);
    const content = await ariaContent.innerHTML();
    if (content) {
      fs.appendFile(`${account}.html`, content, (err) => {
        if (err) {
          console.error("Error writing HTML file:", err);
        } else {
          console.log("HTML file has been saved successfully.");
        }
      });
    }
  };

  for (const { account, timeline } of accounts) {
    const url = `https://twitter.com/${account}/with_replies`;
    await page.goto(url);
    console.log(`Visited ${url}`);

    await page.waitForSelector('article[data-testid="tweet"]');

    // Extract tweet information
    let tweets = await getTweets(page);

    await writePageContent(account, page, '[aria-label="Home timeline"]');

    for (let i = 0; i < 20; i++) {
      await page.waitForTimeout(3000);
      await page.evaluate(() => {
        window.scrollBy({ top: 2000, behavior: "smooth" });
      });
      await writePageContent(account, page, `[aria-label="${timeline}"]`);
    }

    console.log(`Tweets length`, tweets.length);
  }

  await browser.close();
})();
