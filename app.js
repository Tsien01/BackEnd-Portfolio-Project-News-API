const express = require("express")
const cors = require("cors")
const { getTopics, getArticles,getArticleById, getCommentsByArticle, postNewComment, patchArticleById, getUsers, deleteCommentById } = require(`${__dirname}/controllers/controllers.js`)

const app = express()

app.use(cors())
app.use(express.json())

app.get("/api/topics", getTopics)

app.get("/api/articles", getArticles)
app.get("/api/articles/:article_id", getArticleById)

app.get("/api/articles/:article_id/comments", getCommentsByArticle)

app.post("/api/articles/:article_id/comments", postNewComment)

app.patch("/api/articles/:article_id", patchArticleById) //patch inc_vote property of article

app.get("/api/users", getUsers)

app.delete("/api/comments/:comment_id", deleteCommentById)

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
        res.status(404).send({
            message: "Not Found",
            status: 404
        })
    }
    else if (err.code === "42703") {
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
