const { expect } = require("@jest/globals")
const request = require("supertest")
const seed = require(`${__dirname}/../db/seeds/seed.js`)
const db = require(`${__dirname}/../db/connection.js`)
const app = require(`${__dirname}/../app.js`)

const testData = require(`${__dirname}/../db/data/test-data/`)

afterAll(() => {
    if (db.end) return db.end()
})

beforeEach(() => {
    return seed(testData)
})
describe('Happy paths', () => {
    describe('GET /api/topics', () => {
        it('should respond with a status 200 and an array of topic objects', () => {
            return request(app)
                .get("/api/topics")
                .expect(200)
                .then(({ body }) => {
                    expect(body.topics).toHaveLength(3)
                    body.topics.forEach((topic) => {
                        expect(topic).toStrictEqual(
                            expect.objectContaining({
                                description: expect.any(String),
                                slug: expect.any(String)
                            })
                        )
                    })
                })
        });
    });
    describe('GET /api/articles', () => {
        it('should respond with a status 200 and an array of article objects', () => {
            return request(app)
                .get("/api/articles")
                .expect(200)
                .then(({ body }) => {
                    expect(body.articles).toHaveLength(12)
                    body.articles.forEach((article) => {
                        expect(article).toStrictEqual(
                            expect.objectContaining({
                                author: expect.any(String),
                                title: expect.any(String),
                                article_id: expect.any(Number),
                                topic: expect.any(String),
                                created_at: expect.any(String),
                                votes: expect.any(Number),
                                comment_count: expect.any(Number),
                            })
                        )
                    })
                })
        });
        it('should sort the response by created_at(the date) in descending order', () => {
            return request(app)
                .get("/api/articles")
                .expect(200)
                .then(({ body }) => {
                    expect(body.articles).toBeSortedBy("created_at", {
                        descending: true
                    })
                })
        });
    });
    describe('GET /api/articles/:article_id', () => {
        it('should respond with a status 200 and an article object ', () => {
            return request(app)
                .get("/api/articles/3")
                .expect(200)
                .then(({ body }) => {
                    expect(body.article).toStrictEqual(
                        expect.objectContaining(
                            {
                                article_id: 3,
                                title: "Eight pug gifs that remind me of mitch",
                                topic: "mitch",
                                author: "icellusedkars",
                                body: "some gifs",
                                created_at: "2020-11-03T09:12:00.000Z",
                                votes: 0,
                            }
                        )
                    )
                })
        });
    });
    describe('GET /api/articles/:article_id/comments', () => {
        it('should return a status 200 and an array of comment objects sorted by most recent comment first(descending order)', () => {
            return request(app)
                .get("/api/articles/9/comments")
                .expect(200)
                .then(({ body }) => {
                    expect(body.comments).toHaveLength(2)
                    expect(body.comments).toBeSortedBy("created_at", {
                        descending: true
                    })
                    body.comments.forEach((comment) => {
                        expect(comment).toStrictEqual(
                            expect.objectContaining({
                                comment_id: expect.any(Number),
                                votes: expect.any(Number),
                                created_at: expect.any(String),
                                author: expect.any(String),
                                body: expect.any(String),
                            })
                        )
                    })
                })
        });
        it('should return a status 200 and an empty array if a valid, existent ID is provided but no comments are associated with that article', () => {
        return request(app)
            .get("/api/articles/2/comments")
            .expect(200)
            .then(({ body }) => {
                expect(body.comments).toStrictEqual([])
            })
        });
    });
    describe('POST /api/articles/:article_id/comments', () => {
        it('should return a status 201 and a comment object containing the new comment', () => {
            const newComment = {
                username: "rogersop",
                body: "I am posting this comment to this api to see if it works."
            }
            return request(app)
                .post("/api/articles/1/comments")
                .send(newComment)
                .expect(201)
                .then(({ body }) => {
                    expect(body.comment).toStrictEqual(
                        expect.objectContaining({
                            comment_id: expect.any(Number),
                            body: "I am posting this comment to this api to see if it works.",
                            votes: 0, 
                            author: "rogersop",
                            article_id: 1,
                            created_at: expect.any(String)
                        })
                    )
                })
        });
    });
});
describe('Error-handling Sad paths', () => {
    describe('Invalid format ID parameters', () => {
        it('GET /api/articles/:article_id should return a status 400 and an error message if passed an invalid format ID', () => {
            return request(app)
            .get("/api/articles/notAnId")
            .expect(400)
            .then(({ body }) => {
                expect(body).toStrictEqual({
                    message: "Bad Request",
                    status: 400
                })
            })
        });
        it('GET /api/articles/:article_id/comments should return a status 400 and an error message if passed an invalid format ID ', () => {
            return request(app)
            .get("/api/articles/notAnId/comments")
            .expect(400)
            .then(({ body }) => {
                expect(body).toStrictEqual({
                    message: "Bad Request",
                    status: 400
                })
            })
        });
        it('POST /api/articles/:article_id/comments should return a status 400 and a Bad Request error message if passed an invalid format ID', () => {
            const newComment = {
                username: "rogersop",
                body: "I am posting this comment to this api to see if it works."
            }
            return request(app)
            .post("/api/articles/notAnId/comments")
            .send(newComment)
            .expect(400)
            .then(({ body }) => {
                expect(body).toStrictEqual({
                    message: "Bad Request",
                    status: 400
                })
            })
        });
    });
    describe('Valid, non-existent ID parameters', () => {
        it('GET /api/articles/:article_id should return a status 404 and a "not found" message if a valid format, non-existent ID is provided', () => {
            return request(app)
                .get("/api/articles/4321")
                .expect(404)
                .then(({ body }) => {
                    expect(body).toStrictEqual({
                        message: "Not Found",
                        status: 404
                    })
                })
        });
        it('GET /api/articles/:article_id/comments should return a status 404 and a "not found" message if a valid format, non-existent ID is provided', () => {
            return request(app)
                .get("/api/articles/5823/comments")
                .expect(404)
                .then(({ body }) => {
                    expect(body).toStrictEqual({
                        message: "Not Found",
                        status: 404
                    })
                })
        });
        it('POST /api/articles/:article_id/comments should return a status 404 and a "not found" message if a valid format, non-existent ID is provided', () => {
            const newComment = {
                username: "rogersop",
                body: "I am posting this comment to this api to see if it works."
            }
            return request(app)
                .post("/api/articles/5823/comments")
                .send(newComment)
                .expect(404)
                .then(({ body }) => {
                    expect(body).toStrictEqual({
                        message: "Not Found",
                        status: 404
                    })
                })
        });
    });
    describe('Incorrect format object sent', () => {
        describe('POST /api/articles/:article_id/comments should return a status 400 and a "Bad Request" message if an incorrectly formatted object is sent' , () => {
            it('case 1: invalid keys provided', () => {
                const newComment = {
                    user: "rogersop",
                    body: "I am posting this comment to this api to see if it works."
                }
                return request(app)
                    .post("/api/articles/1/comments")
                    .send(newComment)
                    .expect(400)
                    .then(({ body }) => {
                        expect(body).toStrictEqual({
                            message: "Bad Request",
                            status: 400
                        })
                    })
            });
            it('case 2: values provided in invalid format', () => {
                const newComment = {
                    username: "rogersop",
                    body: 54
                }
                return request(app)
                    .post("/api/articles/1/comments")
                    .send(newComment)
                    .expect(400)
                    .then(({ body }) => {
                        expect(body).toStrictEqual({
                            message: "Bad Request",
                            status: 400
                        })
                    })
            });
            it('case 3: missing key in object', () => {
                const newComment = {
                    username: "rogersop"
                }
                return request(app)
                    .post("/api/articles/1/comments")
                    .send(newComment)
                    .expect(400)
                    .then(({ body }) => {
                        expect(body).toStrictEqual({
                            message: "Bad Request",
                            status: 400
                        })
                    })
            });
        });
    });
});