import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import CreateBlogForm from './CreateBlogForm'

describe('<CreateBlogForm /> tests', () => {
  test('event handler receives the right details for creating a new blog', async () => {
    const mockHandler = vi.fn()
    const user = userEvent.setup()
    render(<CreateBlogForm handleCreateBlog={mockHandler} />)

    const titleInput = screen.getByLabelText('title')
    const authorInput = screen.getByLabelText('author')
    const urlInput = screen.getByLabelText('url')
    const submitButton = screen.getByText('create')

    await user.type(titleInput, 'Test Blog')
    await user.type(authorInput, 'John Doe')
    await user.type(urlInput, 'www.example.com')
    await user.click(submitButton)

    console.log(mockHandler.mock.calls[0][0])
    expect(mockHandler.mock.calls).toHaveLength(1)
    expect(mockHandler.mock.calls[0][0].title).toBe('Test Blog')
    expect(mockHandler.mock.calls[0][0].author).toBe('John Doe')
    expect(mockHandler.mock.calls[0][0].url).toBe('www.example.com')
  })
})