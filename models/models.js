const db = require(`${__dirname}/../db/connection.js`)

exports.getAllTopics = () => {
    return db.query("SELECT * FROM topics;").then(((result) => {
        return result.rows;
    }))
} 

exports.getAllArticles = () => {
    return db.query("SELECT * FROM articles ORDER BY created_at DESC").then((result) => {
        return result.rows
    })
}