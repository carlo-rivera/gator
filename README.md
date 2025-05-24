# gator

Aggregate RSS feeds!

## What you'll need

You'll need a Postgres database to run Gator. Just change the URL in the config file.

## Config file

Make a `~/.gatorconfig.json` file, like this, and add your Postgres DB url:
```
{
  "db_url": "postgres://USERNAME:PASSWORD@localhost:PORT/DBNAME?sslmode=disable"
}
```

## Commands

Do `npm run start [command] [args]`. Valid commands: addfeed, agg, browse, feeds, follow, following, login, register, reset, unfollow, users
Start off with `npm run start register YOURNAME`, then add an RSS feed by doing `npm run start addfeed NAME URL` and then scrape posts with `npm run start agg` and then browse posts with `npm run start browse`!
