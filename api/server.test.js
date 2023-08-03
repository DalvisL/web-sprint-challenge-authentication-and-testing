const request = require('supertest')
const server = require('./server')
const db = require('../data/dbConfig')

// Write your tests here
test('sanity', () => {
  expect(true).toBe(true)
})

describe('[POST] /api/auth/register', () => {
  it('should return a 201 status', async () => {
    const res = await request(server)
      .post('/api/auth/register')
      .send({ username: 'test', password: 'test' })
    expect(res.status).toBe(201)
  })
})
