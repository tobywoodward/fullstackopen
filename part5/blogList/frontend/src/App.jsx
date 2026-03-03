import { useState, useEffect, useRef } from 'react'

import Blog from './components/Blog'
import CreateBlogForm from './components/CreateBlogForm'
import LoginForm from './components/LoginForm'
import LogoutForm from './components/LogoutForm'
import Notification from './components/Notification'
import Togglable from './components/Togglable'

import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [notificationMessage, setNotificationMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [user, setUser] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }, [])

  useEffect(() => {
    const loggedinUserJSON = window.localStorage.getItem('loggedinBlogappUser')
    if (loggedinUserJSON) {
      const user = JSON.parse(loggedinUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (username, password) => {
    try {
      const user = await loginService.login({ username, password })

      window.localStorage.setItem(
        'loggedinBlogappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      return true
    } catch {
      setErrorMessage('wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
      return false
    }
  }

  const handleLogout = async event => {
    event.preventDefault()
    setUser(null)
    window.localStorage.removeItem('loggedinBlogappUser')
  }

  const blogFormRef = useRef()

  const handleCreateBlog = async (blogObject) => {
    blogFormRef.current.toggleVisibility()
    const returnedBlog = await blogService.create(blogObject)
    setBlogs(blogs.concat(returnedBlog))
    setNotificationMessage(`a new blog ${returnedBlog.title} by ${returnedBlog.author} added`)
    setTimeout(() => {
      setNotificationMessage(null)
    }, 5000)
  }

  const updateBlog = async (blogObject) => {
    const returnedBlog = await blogService.update(blogObject)
    setBlogs(blogs.map(b => b.id === returnedBlog.id ? returnedBlog : b))
  }

  const handleDeleteBlog = async (id) => {
    await blogService.deleteBlog(id)
    setBlogs(blogs.filter(b => b.id !== id))
  }

  return (
    <div>
      <Notification message={notificationMessage} success={true} />
      <Notification message={errorMessage} success={false} />

      {!user && (
        <LoginForm login={handleLogin} />
      )}
      {user && (
        <div>
          <h2>Blogs</h2>
          <LogoutForm handleLogout={handleLogout} user={user} />
          <br/>
          <Togglable buttonLabel='create new blog' ref={blogFormRef}>
            <CreateBlogForm handleCreateBlog={handleCreateBlog} />
          </Togglable>

          <br/>
          {[...blogs].sort((a, b) => b.likes - a.likes).map(blog =>
            <Blog key={blog.id} blog={blog} updateBlog={updateBlog} handleDeleteBlog={handleDeleteBlog} user={user} />
          )}
        </div>
      )}
    </div>
  )
}

export default App