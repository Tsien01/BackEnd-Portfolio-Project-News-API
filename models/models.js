const db = require(`${__dirname}/../db/connection.js`)
const format = require(`pg-format`)

exports.getAllTopics = () => {
    return db.query("SELECT * FROM topics;").then(((result) => {
        return result.rows;
    }))
} 
exports.getAllArticles = ({ query }) => {
    const queryValues = []
    let _articlesQueryString = "SELECT articles.*, COUNT(comments.article_id) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id"
    if (query.topic !== undefined) {
        queryValues.push(query.topic)
        _articlesQueryString += " WHERE topic = %L"
    }
    if (query.sort_by !== undefined) {
        queryValues.push(query.sort_by)
        _articlesQueryString += " GROUP BY articles.article_id ORDER BY %s"
    }
    else {
        _articlesQueryString += " GROUP BY articles.article_id ORDER BY created_at"
    }
    if (query.order === "asc") {
        _articlesQueryString += " ASC"
    }
    else if (query.order === undefined || query.order === "desc"){
        _articlesQueryString += " DESC"
    }
    else {
        return Promise.reject({
            message: "Bad Request",
            status: 400
        })
    }
    const formattedArticlesQueryString = format(_articlesQueryString, queryValues)
    return db.query(formattedArticlesQueryString)
        .then((articlesData) => {
            if (articlesData.rows.length === 0) {
                return Promise.reject({
                    message: "Not Found",
                    status: 404
                })
            }
            else {
                const formattedArticlesData = articlesData.rows.map((article) => {
                    const formattedArticle = {...article}
                    formattedArticle.comment_count = parseInt(formattedArticle.comment_count, 10)
                    return formattedArticle
                })
                return formattedArticlesData
            }
        })
}
exports.selectArticleById = ({ params }) => {
    return db.query("SELECT articles.*, COUNT(comments.article_id) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id WHERE articles.article_id = $1 GROUP BY articles.article_id", [params.article_id])
        .then((article) => {
            if (article.rows.length !== 0) {
                const formattedArticle = {...article.rows[0]}
                formattedArticle.comment_count = parseInt(formattedArticle.comment_count, 10)
                return formattedArticle
            }
            else return Promise.reject({
                message: "Not Found",
                status: 404
            })
        })
}
exports.selectCommentsByArticle = ({ params }) => {
    return db.query("SELECT article_id FROM articles WHERE article_id = $1", [params.article_id])
    .then((checkArticleId) => {
        if (checkArticleId.rows.length === 0) {
            return Promise.reject({
                message: "Not Found",
                status: 404
            })
        }
        else {
            return db.query("SELECT * FROM comments WHERE article_id=$1 ORDER BY created_at DESC", [params.article_id])
            .then((comments) => {
                return comments.rows
                })
            }
        })
}
exports.insertNewComment = ({ params, body }) => {
    if (typeof body.username !== "string" || typeof body.body !== "string") {
            return Promise.reject({
                message: "Bad Request",
                status: 400
            })
        }
    else {
        return db.query("SELECT article_id FROM articles WHERE article_id = $1", [params.article_id])
        .then((articleIdCheck) => {
            if (articleIdCheck.rows.length === 0) {
                return Promise.reject({
                    message: "Not Found",
                    status: 404
                })
            }
            else {
                return db.query("INSERT INTO comments(body, article_id, author) VALUES ($1, $2, $3) RETURNING *;", [body.body, params.article_id, body.username])
                .then((newComment) => {
                    return newComment.rows[0]
                })
            }
        })
    }
}
exports.updateArticleById = ({ params, body }) => {
    if (typeof body.inc_vote !== "number") {
        return Promise.reject({
            message: "Bad Request",
            status: 400
        })
    }
    else {
        return db.query("SELECT article_id FROM articles WHERE article_id = $1", [params.article_id])
            .then((articleIdCheck) => {
                if (articleIdCheck.rows.length === 0) {
                    return Promise.reject({
                        message: "Not Found",
                        status: 404
                    })
                }
                else {
                    return db.query("UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *", [body.inc_vote, params.article_id])
                        .then((updatedArticle) => {
                            return updatedArticle.rows[0]
                        })
                }
            })
    }
}
exports.getAllUsers = () => {
    return db.query("SELECT * FROM users;")
        .then((users) => {
            return users.rows;
        })
}
exports.deleteSelectedComment = ({ params }) => {
    return db.query("DELETE FROM comments WHERE comment_id=$1 RETURNING *", [params.comment_id])
        .then((deletedData) => {
            if (deletedData.rows.length === 0) {
                return Promise.reject({
                    message: "Not Found", 
                    status: 404, 
                })
            }
            else return "Successfully Deleted";
        })
}