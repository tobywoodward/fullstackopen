const jwt = require('jsonwebtoken')
const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
// const User = require('../models/user')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({}).populate('author', { username: 1, name: 1 })
  response.json(blogs)
})

blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  response.json(blog)
})

blogsRouter.post('/', async (request, response) => {
  if (!request.body.title || !request.body.url) {
    return response.status(400).end()
  } 
  const body = request.body

  if(!request.user) {
    return response.status(400).json({ error: 'userId missing or not valid' })
  }

  const blog = new Blog({
    title: body.title,
    author: request.user,
    url: body.url,
    likes: body.likes
  })

  const savedBlog = await blog.save()

  request.user.blogs = request.user.blogs.concat(savedBlog._id)
  await request.user.save()

  response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', async (request, response) => {
  if (!request.user) {
    return response.status(401).json({error: 'authentication token must be provided to delete a blog'})
  }
  if (!(request.user.blogs.includes(request.params.id))) {
    return response.status(401).json({ error: 'invalid user: you can only delete blogs uploaded by yourself' })
  }

  await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
  const { title, author, url, likes } = request.body

  const blog = await Blog.findById(request.params.id)
    if (!blog) {
      return response.status(404).end()
    }

    blog.title = title
    blog.author = author
    blog.url = url
    blog.likes = likes

    const updatedBlog = await blog.save()
    response.json(updatedBlog)
})

module.exports = blogsRouter