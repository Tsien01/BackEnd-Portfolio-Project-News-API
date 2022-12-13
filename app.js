const express = require("express")
const { getTopics, getArticles,getArticleById } = require(`${__dirname}/controllers/controllers.js`)

const app = express()

app.get("/api/topics", getTopics)

app.get("/api/articles", getArticles)
app.get("/api/articles/:article_id", getArticleById)

app.use((err, req, res, next) => {
    if (err.code === "22P02") {
        res.status(400).send({
            Message: "Invalid ID format."
        })
    }
    else console.log(err)
})

module.exports = app;
