import {useState, useEffect, useRef} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setNotificationWithTimeout } from './reducers/notificationReducer'
import { initializeBlogs, createBlog, likeBlog, deleteBlog } from './reducers/blogReducer'
import { setUser, clearUser } from './reducers/userReducer'
import Blog from './components/Blog'
import Login from './components/Login'
import NewBlog from './components/NewBlog'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/loginService'

import './index.css'

const App = () => {
  const dispatch = useDispatch()

  const blogs = useSelector(state => state.blogs)
  const user = useSelector(state => state.user)
  const [username, setUserName] = useState('')
  const [password, setPassword] = useState('')

  const blogFormRef = useRef()

  const sortedBlogs = [...blogs].sort((a, b) => b.likes - a.likes)

  useEffect(()=>{
    dispatch(initializeBlogs())
  }, [dispatch])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      dispatch(setUser(user))
      blogService.setToken(user.token)
    }
  }, [dispatch])

  const handleLogin = async (event) => {
    event.preventDefault()
    console.log('logging in with', username, password)
    try {
      const user = await loginService.login({username, password})
      dispatch(setUser(user))
      setUserName('')
      setPassword('')
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      blogService.setToken(user.token)
      dispatch(setNotificationWithTimeout('Welcome '+user.name,'success', 5))
    } catch {
      dispatch(setNotificationWithTimeout('Wrong credentials, login failed','error', 5))
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    dispatch(clearUser())
  }

  const handleCreate = async (blogObject) => {
    blogFormRef.current.toggleVisibility()
    try {
      const newBlog = await dispatch(createBlog(blogObject)) 
      dispatch(setNotificationWithTimeout(`Blog ${newBlog.title} added`, 'success', 5))
    } catch (exception) {
      dispatch(setNotificationWithTimeout('Error creating blog', 'error', 5))
    }
  }
  
  const handleLike = (blog) => {
    try {
      dispatch(likeBlog(blog)) // Redux Thunk
      dispatch(setNotificationWithTimeout(`Blog ${blog.title} liked`, 'success', 5))
    } catch(e) {
      dispatch(setNotificationWithTimeout('Error liking blog', 'error', 5))
    }
  }

  const handleDelete=async(blog)=>{
    if(window.confirm(`Are you sure you want to delete blog ${blog.title} by ${blog.author}?`)){
      try{
        dispatch(deleteBlog(blog.id))
        dispatch(setNotificationWithTimeout('Blog '+blog.title+' deleted','success',5))
      } catch{
        dispatch(setNotificationWithTimeout('Error deleting blog','error',5))
      }
    }
  }


  if(user === null) {
    return (
      <div>
        <Notification />
        <Login
          username={username}
          password={password}
          usernameChangeHandler={({ target }) => setUserName(target.value)}
          passwordChangeHandler={({ target }) => setPassword(target.value)}
          handleLogin={handleLogin}
        />
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification />
      
      <div style={{ marginBottom: 10 }}>
        {user.name} logged in 
        <button onClick={handleLogout} style={{ marginLeft: 5 }}>Logout</button>
      </div>

      <Togglable buttonLabel="Create New Blog" ref={blogFormRef} >
        <NewBlog createBlog={handleCreate} />
      </Togglable>

      {sortedBlogs.map(blog =>
        <Blog 
          key={blog.id} 
          blog={blog} 
          handleLike={() => handleLike(blog)} 
          handleDelete={() => handleDelete(blog)} 
          user={user} 
        />
      )}
    </div>
  )
}

export default App