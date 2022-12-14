
const { getAllTopics, getAllArticles, selectArticleById } = require(`${__dirname}/../models/models.js`)

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
exports.getArticleById = (req, res, next) => {
    selectArticleById(req)
        .then((article) => {
            if (article !== undefined) {
                res.status(200).send({ article })
            }
            else res.status(404).send({
                Message: "Article ID not found."
            })
        })
        .catch(next)
}