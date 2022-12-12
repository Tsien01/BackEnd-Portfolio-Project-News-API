# Northcoders News API

## Background

We will be building an API for the purpose of accessing application data programmatically. The intention here is to mimic the building of a real world backend service (such as reddit) which should provide this information to the front end architecture.

Your database will be PSQL, and you will interact with it using [node-postgres](https://node-postgres.com/).

## Environment Variables

To setup this repo, please create a file named .env.test and a file named .env.development. In .env.test, please write PGDATABASE=nc_news_test, and in .env.development, please write PGDATABASE=nc_news on the first line. Finally, please put your SQL password in a new line in both files, formatted as PASSWORD=[Your password].