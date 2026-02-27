const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const assert = require('node:assert')
const app = require('../app')
const Blog = require('../models/blog')
const helper = require('./test_helper.js')

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})
  console.log('cleared')

  const blogObjects = helper.initialBlogs
    .map(blog => new Blog(blog))
  const promiseArray = blogObjects.map(blog => blog.save())
  await Promise.all(promiseArray)
})

describe('api tests', () => {
  describe('when there is initially some data saved', () => {
    test('all blogs are returned', async () => {
      const response = await api.get('/api/blogs')

      assert.strictEqual(response.body.length, helper.initialBlogs.length)
    })

    test('notes are returned as json', async () => {
      await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
    })

    test('unique identifier is called \'id\'', async () => {
      const response = await api.get('/api/blogs')
      const blogs = response.body

      for (const blog of blogs) {
        assert(blog.id)
        assert(!blog._id)
      }
    })

    test('POST successfully creates a new blog post', async () => {
      const newBlog = {
        title: 'post allows you to upload new blogs',
        author: 'Toby Woodward',
        url: 'http://www.example.com',
        likes: 12
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

      const titles = blogsAtEnd.map(n => n.title)
      assert(titles.includes('post allows you to upload new blogs'))
    })

    test('likes defaults to zero if not specified', async () => {
      const newBlog = {
        title: 'post allows you to upload new blogs',
        author: 'Toby Woodward',
        url: 'http://www.example.com'
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogsInDb()
      blogsAtEnd.forEach(blog => {
        if (blog.title.includes('post allows you to upload new blogs')) {
          assert(blog.likes === 0)
        }
      })
    })

    test('missing title receives 400 bad request', async () => {
      const noTitleBlog = {
        author: 'Toby Woodward',
        url: 'http://www.example.com',
        likes: 12
      }

      await api
        .post('/api/blogs')
        .send(noTitleBlog)
        .expect(400)
    })

    test('deletion of a blog', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToDelete = blogsAtStart[0]

      await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204)

      const blogsAtEnd = await helper.blogsInDb()

      const ids = blogsAtEnd.map(b => b.id)
      assert(!ids.includes(blogToDelete.id))

      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)
    })

    test('updating of a blog', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToUpdate = blogsAtStart[0]

      blogToUpdate.likes = 65
      await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(blogToUpdate)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const updatedBlog = await api.get(`/api/blogs/${blogToUpdate.id}`)

      assert.strictEqual(updatedBlog.body.likes, 65)
    })

  })
})

after(async () => {
  await mongoose.connection.close()
})