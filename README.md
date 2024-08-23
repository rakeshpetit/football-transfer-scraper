# Football transfer Scraper

## Run Chrome from Commandline

```
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --remote-debugging-port=9222
```

Using this command, we can run Chrome such that Playwright application can talk
to it.

## Run Playwright

```
yarn extract
```

Both the above commands together will save latest tweets to a `output.json`.

## Post to database

After configuring your Supabase credentials in `.env`, Create the
`transfer_tweets` database table based on the schema in file
`db/database.types.ts`. After this run:

```
yarn post
```

This should save all the tweet data from `output.json` to the Supabase table.
