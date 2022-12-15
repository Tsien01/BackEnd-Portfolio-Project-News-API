const db = require(`${__dirname}/../db/connection.js`)

exports.getAllTopics = () => {
    return db.query("SELECT * FROM topics;").then(((result) => {
        return result.rows;
    }))
} 

exports.getAllArticles = () => {
    return db.query("SELECT articles.*, COUNT(comments.article_id) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id GROUP BY articles.article_id ORDER BY created_at DESC")
        .then((articlesData) => {
            const formattedArticlesData = articlesData.rows.map((article) => {
                const formattedArticle = {...article}
                formattedArticle.comment_count = parseInt(formattedArticle.comment_count, 10)
                return formattedArticle
            })
            return formattedArticlesData
        })
}

exports.selectArticleById = ({ params }) => {
    return db.query("SELECT * FROM articles WHERE article_id=$1;", [params.article_id])
        .then((article) => {
            if (article.rows.length !== 0) {
                return article.rows[0]
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