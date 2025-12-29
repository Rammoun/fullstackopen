import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import NewBlog from './NewBlog'

test('<NewBlog /> updates parent state and calls onSubmit', async () => {
  const createBlog = vi.fn()
  const user = userEvent.setup()

  render(<NewBlog createBlog={createBlog} />)

  const titleInput = screen.getByPlaceholderText('write title here')
  const authorInput = screen.getByPlaceholderText('write author here')
  const urlInput = screen.getByPlaceholderText('write url here')
  const sendButton = screen.getByText('Create')

  await user.type(titleInput, 'Testing with React')
  await user.type(authorInput, 'Vitest User')
  await user.type(urlInput, 'http://vitest.dev')

  await user.click(sendButton)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0].title).toBe('Testing with React')
  expect(createBlog.mock.calls[0][0].author).toBe('Vitest User')
  expect(createBlog.mock.calls[0][0].url).toBe('http://vitest.dev')
})