import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import Blog from './Blog'

describe('<Blog /> tests', () => {
  let blogUser
  let blog
  beforeEach(() => {
    blogUser = {
      username: 'testuser',
      name: 'Test user'
    }

    blog = {
      title: 'Component testing is done with react-testing-library',
      author: 'Albert Einstein',
      url: 'www.example.com/component-testing',
      user: blogUser,
      likes: ''
    }
  })

  test('renders blog title and author without other attributes by default', () => {
    const { container } = render(<Blog blog={blog} />)

    const header = container.querySelector('.blogHeader')
    expect(header).toBeDefined()
    expect(header.textContent).toContain(blog.title)
    expect(header.textContent).toContain(blog.author)

    expect(container.querySelector('.blogDetails')).toBeNull()
  })

  test('renders all blod details when button `show` is pressed', async () => {
    const user = userEvent.setup()
    const { container } = render(<Blog blog={blog} user={blogUser} />)

    const button = screen.getByText('view')
    await user.click(button)

    const header = container.querySelector('.blogHeader')
    expect(header).toBeDefined()
    expect(header.textContent).toContain(blog.title)
    expect(header.textContent).toContain(blog.author)

    const details = container.querySelector('.blogDetails')
    expect(details).toBeDefined()
    expect(details.textContent).toContain(blog.url)
    expect(details.textContent).toContain('Likes:')
  })

  test('if `like` is pressed twice, `handleLike()` is called twice', async () => {
    const mockHandler = vi.fn()
    const user = userEvent.setup()
    render(<Blog blog={blog} updateBlog={mockHandler} user={blogUser} />)

    const expandButton = screen.getByText('view')
    await user.click(expandButton)

    const likeButton = screen.getByText('Like')
    await user.click(likeButton)
    await user.click(likeButton)

    expect(mockHandler.mock.calls).toHaveLength(2)
  })
})

