import { createSlice } from '@reduxjs/toolkit'
import blogService from '../services/blogs'

const blogSlice = createSlice({
  name: 'blogs',
  initialState: [],
  reducers: {
    setBlogs(state, action) {
      return action.payload
    },
    appendBlog(state, action) {
      state.push(action.payload)
    },
    updateBlog(state, action) {
      const updatedBlog = action.payload
      return state.map(blog => 
        blog.id !== updatedBlog.id ? blog : updatedBlog
      )
    },
    removeBlog(state, action) {
      const id = action.payload
      return state.filter(blog => blog.id !== id)
    }
  }
})

export const { setBlogs, appendBlog, updateBlog, removeBlog } = blogSlice.actions

// --- THUNKS (Async Logic) ---

export const initializeBlogs = () => {
  return async dispatch => {
    const blogs = await blogService.getAll()
    dispatch(setBlogs(blogs))
  }
}

export const createBlog = (content) => {
  return async dispatch => {
    const newBlog = await blogService.create(content)
    dispatch(appendBlog(newBlog))
    return newBlog // Return it so App can show notification
  }
}

export const likeBlog = (blog) => {
  return async dispatch => {
    const updatedObject = {
      ...blog,
      likes: blog.likes + 1,
      // If your backend needs user ID specifically:
      user: blog.user.id || blog.user 
    }
    const returnedBlog = await blogService.update(blog.id, updatedObject)
    // The backend might return the user as an ID, so we keep the original user object for UI
    // specific implementation depends on backend populate, but this is usually safe:
    dispatch(updateBlog({ ...returnedBlog, user: blog.user }))
  }
}

export const deleteBlog = (id) => {
  return async dispatch => {
    await blogService.remove(id)
    dispatch(removeBlog(id))
  }
}

export default blogSlice.reducer