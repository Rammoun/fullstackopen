const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

let token = null

const initialBlogs = [
  {
    title: 'HTML is easy',
    author: 'Dijkstra',
    url: 'http://example.com',
    likes: 12,
  },
  {
    title: 'Browser can execute only JavaScript',
    author: 'Ryan Dahl',
    url: 'http://example.com',
    likes: 5,
  },
]

beforeEach(async () => {
  
  await Blog.deleteMany({})
  await User.deleteMany({})

  const passwordHash = await bcrypt.hash('sekret', 10)
  const user = new User({ username: 'root', passwordHash })
  await user.save()
  
  const userForToken = { username: 'root', id: user.id }
  token = jwt.sign(userForToken, process.env.SECRET)
  
  for (let blog of initialBlogs) {
    let blogObject = new Blog({ ...blog, user: user.id })
    await blogObject.save()
  }
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('a valid blog can be added', async () => {
  const newBlog = {
    title: 'Async/Await is magic',
    author: 'Hassan',
    url: 'http://hassan.com',
    likes: 10,
  }
  
  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`) 
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')
  const contents = response.body.map(r => r.title)
  assert.strictEqual(response.body.length, initialBlogs.length + 1)
  assert.ok(contents.includes('Async/Await is magic'))
})

test('adding a blog fails with 401 if token is missing', async () => {
  const newBlog = {
    title: 'No Token Blog',
    url: 'http://fail.com'
  }
  
  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(401) 
})

test('likes default to 0 if missing', async () => {
  const newBlog = {
    title: 'Unknown Likes',
    author: 'Tester',
    url: 'http://example.com'
  }

  const response = await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`) 
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  assert.strictEqual(response.body.likes, 0)
})

test('backend responds with 400 if title is missing', async () => {
  const newBlog = {
    author: 'Tester',
    url: 'http://example.com',
    likes: 5
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`) 
    .send(newBlog)
    .expect(400)
})

test('backend responds with 400 if url is missing', async () => {
  const newBlog = {
    title: 'Missing URL',
    author: 'Tester',
    likes: 5
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`) 
    .send(newBlog)
    .expect(400)
})

test('deletion succeeds with status 204 if id is valid and user is creator', async () => {
  const blogsAtStart = await api.get('/api/blogs')
  const blogToDelete = blogsAtStart.body[0]

  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .set('Authorization', `Bearer ${token}`) 
    .expect(204)

  const blogsAtEnd = await api.get('/api/blogs')
  assert.strictEqual(blogsAtEnd.body.length, initialBlogs.length - 1)
})

test('succeeds in updating likes', async () => {
  const blogsAtStart = await api.get('/api/blogs')
  const blogToUpdate = blogsAtStart.body[0]

  const updatedData = { 
    likes: blogToUpdate.likes + 10 
  }

  await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .send(updatedData)
    .expect(200)
})

after(async () => {
  await mongoose.connection.close()
})