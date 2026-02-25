const _ = require('lodash')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favouriteBlog = (blogs) => {
  if (blogs.length === 0) return null
  return blogs.reduce((fav, blog) => blog.likes > fav.likes ? blog : fav)
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) return null
  const authors = _.toPairs(_.groupBy(blogs, 'author'))
  const highest = authors.reduce((most, author) => author[1].length > most[1].length ? author : most)
  return highest[0]
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) return null
  const authors = _.toPairs(_.groupBy(blogs, 'author'))
  const mostLiked = authors.reduce((most, author) => totalLikes(author[1]) > totalLikes(most[1]) ? author : most)
  return mostLiked[0]
}

module.exports = {
  dummy,
  totalLikes,
  favouriteBlog,
  mostBlogs,
  mostLikes,
}