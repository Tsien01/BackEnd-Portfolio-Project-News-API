# Northcoders News API

Live hosted API link - https://nc-news-api-qy3c.onrender.com

## Endpoints

### GET 
**/api/topics**

Serves up an array of all topics

Sample response: 
```
{
    topics: [
        {
            slug: coding, 
            description: "Code is love, code is life", 
        }, 
    ]
}
```

**/api/articles**

Serves up an array of all articles

Sample response: 
```
{
    articles: [
        {
            article_id: 1, 
            title: "Running a Node App",
            topic: "coding",
            author: "jessjelly",
            body: "This is part two of a series on how to get up and running with Systemd and Node.js. This part dives deeper into how to successfully run your app with systemd long-term, and how to set it up in a production environment.",
            created_at: 1604728980000,
            votes: 0,
            comment_count: 9, 
        }, 
    ]
}
```

**/api/articles/:article_id**

Serves up an object representation of a specific article

```
{
    "article":{
        "article_id":34,
        "title":"The Notorious MSG’s Unlikely Formula For Success",
        "topic":"cooking",
        "author":"grumpy19",
        "body":"The 'umami' craze has turned a much-maligned and misunderstood food additive into an object of obsession for the world’s most innovative chefs. But secret ingredient monosodium glutamate’s biggest secret may be that there was never anything wrong with it at all.",
        "created_at":"2020-11-22T11:13:00.000Z","votes":108,"comment_count":13
        }
    }
```

**/api/articles/:article_id/comments**

Serves up an array of all comments for a given article

```
{
    comments: [
        {
            comment_id: 321, 
            body: "testing", 
            article_id: 34, 
            author: "cooljmessy", 
            votes: 0, 
            created_at	"2023-01-13T15:03:39.741Z", 
        }
    ]
}
```

**/api/users**

Serves up a list of registered users

```
{
    users: [
        {
            username: "username", 
            name: "user's name", 
            avatar_url: "https://someurl.net"
        }, 
    ]
}
```

### POST
**/api/articles/:article_id/comments**

Adds a new comment to a given article

Sample expected body: 
```
{
    username: "posting users username", 
    body: "comment text here", 
}
```

Responds with a JSON representation of the newly added comment: 
```
{
    comment_id: 123,
    body: "I am posting this comment to this api to see if it works.",
    votes: 0, 
    author: "rogersop",
    article_id: 1,
    created_at	"2023-01-13T15:03:39.741Z" 
}
```

### PATCH
**/api/articles/:article_id**

Sample expected body: 
```
{
    inc_vote: 1, 
}
```

Changes the vote count of the specified article by the given value. Responds with a JSON representation of the patched article. 

```
{
    article_id: 2,
    title: "Sony Vaio; or, The Laptop",
    topic: "mitch",
    author: "icellusedkars",
    body: "article text", 
    created_at	"2023-01-13T15:03:39.741Z"
}
```

### DELETE
**/api/comments/:comment_id**

Deletes a comment. Responds with a message confirming deletion: 
```
{
    message: "Successfully Deleted!"
}
```

## Background

We will be building an API for the purpose of accessing application data programmatically. The intention here is to mimic the building of a real world backend service (such as reddit) which should provide this information to the front end architecture.

Your database will be PSQL, and you will interact with it using [node-postgres](https://node-postgres.com/).

## Environment Variables

To setup this repo, please create a file named .env.test and a file named .env.development. In .env.test, please write PGDATABASE=nc_news_test, and in .env.development, please write PGDATABASE=nc_news on the first line. Finally, please put your SQL password in a new line in both files, formatted as PASSWORD=[Your password].