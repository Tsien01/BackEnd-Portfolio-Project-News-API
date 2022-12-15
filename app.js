const express = require("express")
const { getTopics, getArticles,getArticleById, getCommentsByArticle } = require(`${__dirname}/controllers/controllers.js`)

const app = express()

app.get("/api/topics", getTopics)

app.get("/api/articles", getArticles)
app.get("/api/articles/:article_id", getArticleById)

app.get("/api/articles/:article_id/comments", getCommentsByArticle)

app.use((err, req, res, next) => {
    if (err.code === "22P02") {
        res.status(400).send({
            message: "Bad Request",
            status: 400
        })
    }
    else if (err.status === 404) {
        res.status(err.status).send(err)
    }
    else console.log(err)
    next();
})

module.exports = app;
