const express = require("express")
const { getTopics, getArticles } = require(`${__dirname}/controllers/controllers.js`)

const app = express()

app.get("/api/topics", getTopics)

app.get("/api/articles", getArticles)

app.use((err, req, res, next) => {
    console.log(err)
})

module.exports = app;
