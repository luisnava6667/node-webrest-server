import request from 'supertest'
import { testServer } from '../../test-server'
import { prisma } from '../../../src/data/postgres'

describe('Todo route testing', () => {
  beforeAll(async () => {
    await testServer.start()
  })
  afterAll(() => {
    testServer.close()
  })
  beforeEach(async () => {
    await prisma.todo.deleteMany()
  })
  const todo1 = {
    text: 'Hola Mundo'
  }
  const todo2 = {
    text: 'Hola Mundo'
  }
  test('should return TODOs api/todos', async () => {
    await prisma.todo.createMany({ data: [todo1, todo2] })
    const { body } = await request(testServer.app).get('/api/todos').expect(200)
    expect(body).toBeInstanceOf(Array)
    expect(body.length).toBe(2)
    expect(body[0].text).toBe(todo1.text)
    expect(body[1].text).toBe(todo2.text)
    expect(body[0].completedAt).toBeNull()
  })
  test('should return a TODO api/todos/:id ', async () => {
    const todo = await prisma.todo.create({ data: todo1 })
    const { body } = await request(testServer.app)
      .get(`/api/todos/${todo.id}`)
      .expect(200)
    expect(body).toEqual({
      id: todo.id,
      text: todo.text,
      completedAt: todo.completedAt
    })
  })
  test('should return a 404 NoFound api/todos/:id ', async () => {
    const todoId = 9999
    const { body } = await request(testServer.app)
      .get(`/api/todos/${todoId}`)
      .expect(404)
    expect(body).toEqual({ error: `Todo with id ${todoId} not found` })
  })

  test('should return a new Todo api/todo', async () => {
    const { body } = await request(testServer.app)
      .post(`/api/todos`)
      .send(todo1)
      .expect(201)
    expect(body).toEqual({
      id: expect.any(Number),
      text: todo1.text,
      completedAt: null
    })
  })
  test('should return an Error if text is not present Todo api/todo', async () => {
    const { body } = await request(testServer.app)
      .post(`/api/todos`)
      .send({})
      .expect(400)
    expect(body).toEqual({ error: 'Text property is required' })
  })
  test('should return an Error if text is empty  Todo api/todo', async () => {
    const { body } = await request(testServer.app)
      .post(`/api/todos`)
      .send({ text: '' })
      .expect(400)
    expect(body).toEqual({ error: 'Text property is required' })
  })
  test('should return an update Todo api/todo/:id', async () => {
    const todo = await prisma.todo.create({ data: todo1 })
    const { body } = await request(testServer.app)
      .put(`/api/todos/${todo.id}`)
      .send({ text: 'Hola desde test UPDATE', completedAt: '2023-10-21' })
      .expect(200)
    expect(body).toEqual({
      id: expect.any(Number),
      text: 'Hola desde test UPDATE',
      completedAt: '2023-10-21T00:00:00.000Z'
    })
  })
  test('should return 404 if TODO not found ', async () => {
    const { body } = await request(testServer.app)
      .put(`/api/todos/9999`)
      .send({ text: 'Hola desde test UPDATE', completedAt: '2023-10-21' })
      .expect(404)
    expect(body).toEqual({ error: 'Todo with id 9999 not found' })
  })
  test('should return a update TODO only the date', async () => {
    const todo = await prisma.todo.create({ data: todo1 })
    const { body } = await request(testServer.app)
      .put(`/api/todos/${todo.id}`)
      .send({ completedAt: '2023-10-21' })
      .expect(200)
    expect(body).toEqual({
      id: todo.id,
      text: todo.text,
      completedAt: '2023-10-21T00:00:00.000Z'
    })
  })
  test('should delete a TODO api/todo/:id', async () => {
    const todo = await prisma.todo.create({ data: todo1 })
    const { body } = await request(testServer.app)
      .delete(`/api/todos/${todo.id}`)
      .expect(200)
    expect(body).toEqual({
      id: expect.any(Number),
      text: todo.text,
      completedAt: null
    })
  })
  test('should return 404 if todo do not exist  api/todo/:id', async () => {
    const { body } = await request(testServer.app)
      .delete(`/api/todos/9999`)
      .expect(404)
    expect(body).toEqual({ error: 'Todo with id 9999 not found' })
  })
})
