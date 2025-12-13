import {useState, useEffect, useRef} from 'react'
import Blog from './components/Blog'
import Login from './components/Login'
import NewBlog from './components/NewBlog'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/loginService'

import './index.css'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUserName] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser]=useState(null)
  const [notificationMessage, setNotificationMessage] = useState(null)
  const [notificationClassName, setNotificationClassName] = useState('')

  const blogFormRef = useRef()

  useEffect(()=>{
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if(loggedUserJSON){
      const user=JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  },[])

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    console.log('logging in with', username, password)
    try {
      const user = await loginService.login({username, password})
      setUser(user)
      setUserName('')
      setPassword('')
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setNotificationMessage('Welcome '+user.name)
      setNotificationClassName('success')
      setTimeout(() => {
        setNotificationMessage(null)
      }, 5000)
    } catch {
      setNotificationMessage('Wrong credentials, login failed')
      setNotificationClassName('error')
      console.log("LOGIN ERROR")
      setTimeout(() => {
        setNotificationMessage(null)
      }, 5000)
    }
  }

  const usernameChangeHandler = (event) => {
    setUserName(event.target.value)
  }

  const passwordChangeHandler = (event) => {
    setPassword(event.target.value)
  }

  const handleCreate = async (blogObject) => {
  blogFormRef.current.toggleVisibility()

  try {
    const returnedBlog = await blogService.create(blogObject)
    
    setBlogs(blogs.concat(returnedBlog))
    setNotificationMessage(`Blog ${returnedBlog.title} added`)
    setNotificationClassName('success')
    setTimeout(() => {
      setNotificationMessage(null)
    }, 5000)
  } catch (exception) {
    setNotificationMessage('Error creating blog')
    setNotificationClassName('error')
    setTimeout(() => {
      setNotificationMessage(null)
    }, 5000)
  }
}
  const addBlog= async (event) => {
    event.preventDefault()
    blogFormRef.current.toggleVisibility()
    const newBlog={
      'title':event.target[0].value,
      'author':event.target[1].value,
      'url':event.target[2].value,
    }
    try{
      const returnedBlog=await blogService.create(newBlog)
      setBlogs(blogs.concat(returnedBlog))
      setNotificationMessage('Blog '+returnedBlog.title+' added')
      setNotificationClassName('success')
      setTimeout(() => {
        setNotificationMessage(null)
      }, 5000)
    } catch{
      setNotificationMessage('Error creating blog')
      setNotificationClassName('error')
      console.log(notificationMessage)
      setTimeout(() => {
        setNotificationMessage(null)
      }, 5000)
    }

  }

  const handleLike=async(blog)=>{
    const updatedBlog={
      user: blog.user.id || blog.user,
      likes: blog.likes + 1,
      author: blog.author,
      title: blog.title,
      url: blog.url
    }
    console.log('liking blog',blog.user.id,updatedBlog)
    try{
      const returnedBlog=await blogService.update(blog.id,updatedBlog)
      const fixedBlog = {...returnedBlog, user: blog.user}
      console.log('returned blog',fixedBlog)
      setBlogs(blogs.map(b=>b.id!==blog.id?b:fixedBlog))
      setNotificationMessage('Blog '+fixedBlog.title+' liked')
      setNotificationClassName('success')
      setTimeout(() => {
        setNotificationMessage(null)
      }, 5000)
    } catch{
      console.log('error liking blog')
      setNotificationMessage('error liking blog')
      setNotificationClassName('error')
      setTimeout(() => {
        setNotificationMessage(null)
      }, 5000)
    }
  }

  const handleDelete=async(blog)=>{
    if(window.confirm(`Are you sure you want to delete blog ${blog.title} by ${blog.author}?`)){
      try{
        await blogService.remove(blog.id)
        setBlogs(blogs.filter(b=>b.id!==blog.id))
        setNotificationMessage('Blog '+blog.title+' deleted')
        setNotificationClassName('success')
      } catch{
        setNotificationMessage('Error deleting blog')
        setNotificationClassName('error')
      }
    }
  }


  if(user === null) {
    return (
      <div>
        <Notification message={notificationMessage} className={notificationClassName}/>
        <Login
          username={username}
          password={password}
          usernameChangeHandler={usernameChangeHandler}
          passwordChangeHandler={passwordChangeHandler}
          handleLogin={handleLogin}
        />
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification message={notificationMessage} className={notificationClassName}/>
      {console.log('Local storage user:', window.localStorage.getItem('loggedBlogappUser'))}
      <h3>{user.name} logged in</h3>
      <button onClick={()=>{
        window.localStorage.removeItem('loggedBlogappUser')
        setUser(null)
      }}>Logout</button>
      <Togglable buttonLabel="Create New Blog" ref={blogFormRef} >
        <NewBlog createBlog={handleCreate} />
      </Togglable>
      {blogs.sort((a, b) => b.likes - a.likes).map(blog =>
        <Blog key={blog.id} blog={blog} handleLike={()=>handleLike(blog)} handleDelete={()=>handleDelete(blog)} user={user} />
      )}
    </div>
  )
}

export default App