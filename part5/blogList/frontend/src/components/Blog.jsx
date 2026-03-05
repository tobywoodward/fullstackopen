import { useState } from 'react'

const Blog = ({ blog, updateBlog, handleDeleteBlog, user }) => {
  const [expanded, setExpanded] = useState(false)

  const handleLike = () => {
    const newBlog = { ...blog, likes: blog.likes + 1 }
    updateBlog(newBlog)
  }

  return (
    <div className='blog'>
      <div className='blogHeader'>
        {blog.title} by {blog.author}
        <button onClick={() => setExpanded(!expanded)}>{expanded ? 'hide' : 'view'}</button>
      </div>
      {/* <br/> */}
      {expanded && (
        <div className='blogDetails'>
          {blog.url}<br/>
          Likes: {blog.likes}
          <button onClick={handleLike}>Like</button>
          <br/>
          {blog.user.name}<br/>
          {user.username === blog.user.username && (
            <button onClick={() => {if (window.confirm(`Remove ${blog.title} by ${blog.author}`)) {handleDeleteBlog(blog.id)}}}>remove</button>
          )}
        </div>
      )}
    </div>
  )}

export default Blog