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
            return article.rows[0]
        })
}