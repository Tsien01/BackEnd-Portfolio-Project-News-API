
const { getAllTopics } = require(`${__dirname}/../models/models.js`)

exports.getTopics = (req, res, next) => {
    getAllTopics()
        .then((topics) => {
            res.status(200).send(topics)
        })
}