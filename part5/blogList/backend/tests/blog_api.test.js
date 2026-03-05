const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const assert = require('node:assert')
const bcrypt = require('bcrypt')

const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')
const helper = require('./test_helper.js')

const api = supertest(app)

describe('api tests', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})
    await User.deleteMany({})
    // console.log('cleared')

    const userPromises = helper.initialUsers.map(async (u) => {
      const passwordHash = await bcrypt.hash(u.password, 10)
      const user = new User({ username: u.username, name: u.name, passwordHash })
      return user.save()
    })
    const savedUsers = await Promise.all(userPromises)

    for (const b of helper.initialBlogs) {
      const currentAuthor = savedUsers.find(u => u.name === b.author)
      const blog = new Blog({
        ...b,
        author: currentAuthor._id
      })
      await blog.save()

      currentAuthor.blogs = currentAuthor.blogs.concat(blog)
      await currentAuthor.save()
    }
  })

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
      const loginResponse = await api
        .post('/api/login')
        .send({ username: helper.initialUsers[0].username, password: helper.initialUsers[0].password })
      const token = loginResponse.body.token
      
      const newBlog = {
        title: 'post allows you to upload new blogs',
        url: 'http://www.example.com',
        likes: 12
      }

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

      const titles = blogsAtEnd.map(n => n.title)
      assert(titles.includes('post allows you to upload new blogs'))
    })

    test('likes defaults to zero if not specified', async () => {
      const loginResponse = await api
        .post('/api/login')
        .send({ username: helper.initialUsers[0].username, password: helper.initialUsers[0].password })
      const token = loginResponse.body.token
      
      const newBlog = {
        title: 'post allows you to upload new blogs',
        url: 'http://www.example.com'
      }

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
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
      const loginResponse = await api
        .post('/api/login')
        .send({ username: helper.initialUsers[0].username, password: helper.initialUsers[0].password })
      const token = loginResponse.body.token

      const blogsAtStart = await helper.blogsInDb()
      const blogToDelete = blogsAtStart[0]

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(204)

      const blogsAtEnd = await helper.blogsInDb()

      const ids = blogsAtEnd.map(b => b.id)
      assert(!ids.includes(blogToDelete.id))

      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)
    })

    test('deletion fails with code 401 if no token is provided', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToDelete = blogsAtStart[0]

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .expect(401)

      const blogsAtEnd = await helper.blogsInDb()

      const ids = blogsAtEnd.map(b => b.id)
      assert(ids.includes(blogToDelete.id))

      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
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

describe('user tests', () => {
  describe('when there is initially one user in the db', () => {
    beforeEach(async () => {
      await User.deleteMany({})

      const passwordHash = await bcrypt.hash('sekret', 10)
      const user = new User({ username: 'root', passwordHash })

      await user.save()
    })

    test('creation succeeds with a fresh username', async () => {
      const usersAtStart = await helper.usersInDb()

      const newUser = {
        username: 'mluukkai',
        name: 'Matti Luukkainen',
        password: 'salainen',
      }

      await api
        .post('/api/users')
        .send(newUser)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const usersAtEnd = await helper.usersInDb()
      assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

      const usernames = usersAtEnd.map(u => u.username)
      assert(usernames.includes(newUser.username))
    })

    test('creation fails with proper statuscode and message if username already taken', async () => {
      const usersAtStart = await helper.usersInDb()

      const newUser = {
        username: 'root',
        name: 'Superuser',
        password: 'salainen',
      }

      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      const usersAtEnd = await helper.usersInDb()
      assert(result.body.error.includes('expected `username` to be unique'))

      assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    })
  })

  test('creation fails with proper statuscode and message if username is shorter than 3 characters', async () => {
    const usersAtStart = await helper.usersInDb()

      const newUser = {
        username: 'AA',
        name: 'Short User',
        password: 'secure',
      }

      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      const usersAtEnd = await helper.usersInDb()
      assert(result.body.error.includes('is shorter than the minimum allowed length (3)'))

      assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test('creation fails with proper statuscode and message if password is shorter than 3 characters', async () => {
    const usersAtStart = await helper.usersInDb()

      const newUser = {
        username: 'Test',
        name: 'Short Password',
        password: 'AA',
      }

      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      const usersAtEnd = await helper.usersInDb()
      assert(result.body.error.includes('password must contain at least 3 characters'))

      assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })
})

after(async () => {
  await mongoose.connection.close()
})