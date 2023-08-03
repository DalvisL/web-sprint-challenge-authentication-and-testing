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
describe('[POST] /api/auth/login', () => {
  beforeEach(async () => {
    await request(server)
      .post('/api/auth/register')
      .send({ username: 'test', password: 'test' })
  })
  it('should return a 200 status', async () => {
    const res = await request(server)
      .post('/api/auth/login')
      .send({ username: 'test', password: 'test' })
    expect(res.status).toBe(200)
  })
  it('should return a 400 status if username or password is missing', async () => {
    const res = await request(server)
      .post('/api/auth/login')
      .send({ username: 'test' })
    expect(res.status).toBe(400)
  })
  it('should return a 401 status if username is not found', async () => {
    const res = await request(server)
      .post('/api/auth/login')
      .send({ username: 'test2', password: 'test' })
    expect(res.status).toBe(401)
  })
  it('should set a token in the body', async () => {
    const res = await request(server)
      .post('/api/auth/login')
      .send({ username: 'test', password: 'test' })
    expect(res.body).toHaveProperty('token')
  })
})
describe('[GET] /api/jokes', () => {
  beforeEach(async () => {
    await request(server)
      .post('/api/auth/register')
      .send({ username: 'test', password: 'test' })
    
  })
  it('should return a 200 status', async () => {
    // set auth header on the request
    const loginRes = await request(server)
      .post('/api/auth/login')
      .send({ username: 'test', password: 'test' })

    const token = loginRes.body.token
    const res = await request(server)
      .get('/api/jokes')
      .set('Authorization', token)
    expect(res.status).toBe(200)
  })
  it('should return a 401 status if no token is provided', async () => {
    const res = await request(server)
      .get('/api/jokes')
    expect(res.status).toBe(401)
  })
  it('should return an array of jokes', async () => {
    const loginRes = await request(server)
      .post('/api/auth/login')
      .send({ username: 'test', password: 'test' })
    const token = loginRes.body.token
    const res = await request(server)
      .get('/api/jokes')
      .set('Authorization', token)
    expect(res.body).toHaveLength(3)
  })
})
