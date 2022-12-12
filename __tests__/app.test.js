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

describe('Name of the group', () => {
    it('should ', () => {
        
    });
});