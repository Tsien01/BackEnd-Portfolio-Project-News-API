const db = require(`${__dirname}/../db/connection.js`)

exports.getAllTopics = () => {
    return db.query("SELECT * FROM topics;").then(((result) => {
        return result.rows;
    }))
} 

exports.getAllArticles = () => {
    const articlesData = db.query("SELECT * FROM articles ORDER BY created_at DESC")
        .then((articles) => {
            return articles.rows
        })
    const commentCountReferenceObj = db.query("SELECT article_id, COUNT(*) AS comment_count FROM comments GROUP BY article_id;")
        .then((commentCounts) => {
            const refObj = {}
            commentCounts.rows.forEach((commentCount) => {
                refObj[commentCount.article_id] = commentCount.comment_count
            })
            return refObj
        })
    return Promise.all([articlesData, commentCountReferenceObj])
        .then((results) => {
            const articles = results[0]
            const refObj = results[1]
            return articles.map((article) => {
                const formattedArticle = {...article}
                if (refObj[article.article_id] !== undefined) {
                    formattedArticle.comment_count = parseInt(refObj[article.article_id], 10)
                }
                else formattedArticle.comment_count = 0
                return formattedArticle
            })
        })
}

exports.selectArticleById = ({ params }) => {
    return db.query("SELECT * FROM articles WHERE article_id=$1;", [params.article_id])
        .then((article) => {
            return article.rows[0]
        })
}