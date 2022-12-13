const express = require("express")
const { getTopics } = require(`${__dirname}/controllers/controllers.js`)

const app = express()

app.get("/api/topics", getTopics)

module.exports = app;
