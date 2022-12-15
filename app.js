const express = require("express")
const { getTopics, getArticles,getArticleById, getCommentsByArticle, postNewComment } = require(`${__dirname}/controllers/controllers.js`)

const app = express()

app.use(express.json())

app.get("/api/topics", getTopics)

app.get("/api/articles", getArticles)
app.get("/api/articles/:article_id", getArticleById)

app.get("/api/articles/:article_id/comments", getCommentsByArticle)

app.post("/api/articles/:article_id/comments", postNewComment)

app.use((err, req, res, next) => {
    if (err.code === "22P02") {
        res.status(400).send({
            message: "Bad Request",
            status: 400
        })
    }
    else if (err.code === "23502") {
        res.status(400).send({
            message: "Bad Request",
            status: 400
        })
    }
    else if (err.code === "23503") {
        res.status(400).send({
            message: "Bad Request",
            status: 400
        })
    }
    else if (err.status !== undefined) {
        res.status(err.status).send(err)
    }
    else console.log(err)
    next();
})

module.exports = app;
