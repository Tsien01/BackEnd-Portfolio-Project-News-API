
const { getAllTopics, getAllArticles, selectArticleById, selectCommentsByArticle, insertNewComment, updateArticleById, getAllUsers } = require(`${__dirname}/../models/models.js`)

exports.getTopics = (req, res, next) => {
    getAllTopics()
        .then((topics) => {
            res.status(200).send({ topics })
        })
        .catch(next)
}
exports.getArticles = (req, res, next) => {
    getAllArticles()
        .then((articles) => {
            res.status(200).send({ articles })
        })
        .catch(next)
}
exports.getArticleById = (req, res, next) => {
    selectArticleById(req)
        .then((article) => {
            if (article !== undefined) {
                res.status(200).send({ article })
            }
        })
        .catch((error) => {
            next(error)
        })
}
exports.getCommentsByArticle = (req, res, next) => {
    selectCommentsByArticle(req)
        .then((comments) => {
            res.status(200).send({ comments })
        })
        .catch((error) => {
            next(error)
        })
}
exports.postNewComment = (req, res, next) => {
    insertNewComment(req)
        .then((comment) => {
            res.status(201).send({ comment })
        })
        .catch((error) => {
            next(error)
        })
}
exports.patchArticleById = (req, res, next) => {
    updateArticleById(req)
        .then((article) => {
            res.status(202).send({ article })
        })
        .catch((error) => {
            next(error)
        })
}
exports.getUsers = (req, res, next) => {
    getAllUsers(req)
        .then((users) => {
            res.status(200).send({ users })
        })
        .catch((error) => {
            next(error)
        })
}