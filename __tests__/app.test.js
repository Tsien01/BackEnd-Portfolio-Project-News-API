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

describe('GET /api/topics', () => {
    it('should respond with a status 200 and an array of topic objects', () => {
        return request(app)
            .get("/api/topics")
            .expect(200)
            .then(({ body }) => {
                expect(body).toHaveLength(3)
                body.forEach((topic) => {
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
                expect(body).toHaveLength(12)
                body.forEach((article) => {
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
                expect(body).toBeSortedBy("created_at", {
                    descending: true
                })
            })
    });
});
describe('GET /api/articles/:article_id', () => {
    it('should respond with a status 200 and an author object ', () => {
        return request(app)
            .get("/api/articles/3")
            .expect(200)
            .then(({ body }) => {
                expect(body.article).toStrictEqual(
                    expect.objectContaining({
                        author: expect.any(String),
                        title: expect.any(String),
                        article_id: expect.any(Number),
                        body: expect.any(String),
                        topic: expect.any(String),
                        created_at: expect.any(String),
                        votes: expect.any(Number)
                    })
                )
            })
    });
    it('should return a status 404 and an error message if passed a non-existent ID', () => {
        return request(app)
            .get("/api/articles/4321")
            .expect(404)
            .then(({ body }) => {
                expect(body).toStrictEqual({
                    Message: "Article ID not found."
                })
            })
    });
    it('should return a status 400 and an error message if passed an invalid format ID', () => {
        return request(app)
            .get("/api/articles/notAnId")
            .expect(400)
            .then(({ body }) => {
                expect(body).toStrictEqual({
                    Message: "Invalid ID format."
                })
            })
    });
});