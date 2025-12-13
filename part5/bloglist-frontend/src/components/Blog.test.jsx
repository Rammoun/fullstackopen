import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe('<Blog />', () => {
  const blog = {
    title: 'Testing is useful',
    author: 'C. Martin',
    url: 'http://clean-code.com',
    likes: 10,
    user: {
      username: 'root',
      name: 'Super User'
    }
  }

  const user = {
    username: 'root'
  }

  let container

  test('renders title and author', () => {
    container = render(<Blog blog={blog} user={user} />).container

    const element = screen.getByText('Testing is useful C. Martin')
    expect(element).toBeDefined()
    
    const div = container.querySelector('.blog-details') 
  })

  test('at start the children are not displayed', async () => {
    const mockHandler = vi.fn()
    
    render(<Blog blog={blog} user={user} handleLike={mockHandler} />)

    const userSession = userEvent.setup()
    const button = screen.getByText('Show')
    await userSession.click(button)

    const urlElement = screen.getByText('http://clean-code.com', { exact: false })
    const likesElement = screen.getByText('Likes: 10', { exact: false })
    
    expect(urlElement).toBeDefined()
    expect(likesElement).toBeDefined()
  })

  test('if the like button is clicked twice, the event handler is called twice', async () => {
    const mockHandler = vi.fn()

    render(<Blog blog={blog} user={user} handleLike={mockHandler} />)

    const userSession = userEvent.setup()
    
    const viewButton = screen.getByText('Show')
    await userSession.click(viewButton)

    const likeButton = screen.getByText('Like')
    
    await userSession.click(likeButton)
    await userSession.click(likeButton)

    expect(mockHandler.mock.calls).toHaveLength(2)
  })
})