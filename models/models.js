const db = require(`${__dirname}/../db/connection.js`)

exports.getAllTopics = () => {
    return db.query("SELECT * FROM topics;").then(((result) => {
        return result.rows;
    }))
} 