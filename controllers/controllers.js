
const { getAllTopics, getAllArticles } = require(`${__dirname}/../models/models.js`)

exports.getTopics = (req, res, next) => {
    getAllTopics()
        .then((topics) => {
            res.status(200).send(topics)
        })
        .catch(next)
}
exports.getArticles = (req, res, next) => {
    getAllArticles()
        .then((articles) => {
            res.status(200).send(articles)
        })
        .catch(next)
}
