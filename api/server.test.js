const request = require('supertest')
const server = require('./server')
const db = require('../data/dbConfig')

beforeAll(async () => {
  await db.migrate.rollback()
  await db.migrate.latest()
})

beforeEach(async () => {
  await db('users').truncate()
})

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
  it('should add a user to the db', async () => {
    await request(server)
      .post('/api/auth/register')
      .send({ username: 'test', password: 'test' })
    const users = await db('users')
    expect(users).toHaveLength(1)
  })
  it('should return the new user', async () => {
    const res = await request(server)
      .post('/api/auth/register')
      .send({ username: 'test', password: 'test' })
    expect(res.body).toMatchObject({ id: 1, username: 'test' })
  })
  it('should return a 400 status if username or password is missing', async () => {
    const res = await request(server)
      .post('/api/auth/register')
      .send({ username: 'test' })
    expect(res.status).toBe(400)
  })
  it('should return a 401 status if username is taken', async () => {
    await request(server)
      .post('/api/auth/register')
      .send({ username: 'test', password: 'test' })
    const res2 = await request(server)
      .post('/api/auth/register')
      .send({ username: 'test', password: 'test' })
    expect(res2.status).toBe(401)
  })
  
})
