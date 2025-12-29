import {useState, useEffect, useRef} from 'react'
import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query'
import { Routes, Route, Link, useMatch } from 'react-router-dom'
import {useUserValue, useUserDispatch} from './UserContext'
import {useNotificationDispatch} from './NotificationContext'
import ResponsiveAppBar from './components/ResponsiveAppBar'
import Blog from './components/Blog'
import Login from './components/Login'
import NewBlog from './components/NewBlog'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import Users from './components/Users'
import User from './components/User'
import blogService from './services/blogs'
import loginService from './services/loginService'

import './index.css'

const App = () => {
  const queryClient = useQueryClient()
  const dispatch = useNotificationDispatch()
  const userDispatch = useUserDispatch()
  const user = useUserValue()

  const result = useQuery({
    queryKey: ['blogs'],
    queryFn: blogService.getAll,
    retry: 1
  })

  const [username, setUserName] = useState('')
  const [password, setPassword] = useState('')

  const blogFormRef = useRef()


  const notify = (message, type = 'success') => {
    dispatch({type: 'SET', payload: {message, type}})
    setTimeout(() => {
      dispatch({type: 'CLEAR'})
    }, 5000)
  }

  const newBlogMutation = useMutation({
    mutationFn: blogService.create,
    onSuccess: (newBlog) => {
      const blogs = queryClient.getQueryData(['blogs'])
      queryClient.setQueryData(['blogs'], blogs.concat(newBlog))

      notify(`Blog ${newBlog.title} added`, 'success')
    },
    onError: () => {
      notify('Error creating blog', 'error')
    }
  })

  const updateBlogMutation = useMutation({
    mutationFn: async (updatedBlog) => {
      return await blogService.update(updatedBlog.id, updatedBlog)
    },
    onSuccess: (returnedBlog, variables) => {
      const blogs = queryClient.getQueryData(['blogs'])

      queryClient.setQueryData(['blogs'], blogs.map(blog =>
        blog.id !== returnedBlog.id ? blog : {...returnedBlog, user: blog.user}
      ))

      const singleBlogKey = ['blog', returnedBlog.id]
      const singleBlog = queryClient.getQueryData(singleBlogKey)
      
      if (singleBlog) {
        queryClient.setQueryData(singleBlogKey, { 
          ...returnedBlog, 
          user: singleBlog.user
        })
      }

      notify(`Blog ${returnedBlog.title} updated`, 'success')
    },
    onError: () => {
      notify('Error updating blog', 'error')
    }
  })

  const commentBlogMutation = useMutation({
    mutationFn: async (commentedBlog) => {
      return await blogService.comment(commentedBlog.id, commentedBlog)
    },
    onSuccess: (returnedBlog, variables) => {
      const blogs = queryClient.getQueryData(['blogs'])

      queryClient.setQueryData(['blogs'], blogs.map(blog =>
        blog.id !== variables.id ? blog : {...variables, user: blog.user}
      ))

      const singleBlogKey = ['blog', variables.id]
      const singleBlog = queryClient.getQueryData(singleBlogKey)
      
      if (singleBlog) {
        queryClient.setQueryData(singleBlogKey, { 
          ...variables, 
          user: singleBlog.user
        })    
      }

      notify(`Blog ${variables.title} commented`, 'success')
    },
    onError: () => {
      notify('Error updating blog', 'error')
    }
  })

  const deleteBlogMutation = useMutation({
    mutationFn: blogService.remove,
    onSuccess: (data, id) => {
      const blogs = queryClient.getQueryData(['blogs'])

      queryClient.setQueryData(['blogs'], blogs.filter(b => b.id !== id))

      notify('Blog deleted', 'success')
    },
    onError: () => {
      notify('Error deleting blog', 'error')
    }
  })

  const handleCreate = async (blogObject) => {
    blogFormRef.current.toggleVisibility()
    newBlogMutation.mutate(blogObject)
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    console.log('logging in with', username, password)
    try {
      const user = await loginService.login({username, password})
      userDispatch({type: 'SET_USER', payload: user})
      setUserName('')
      setPassword('')
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      blogService.setToken(user.token)
      notify(`Welcome ${user.name}`, 'success')
    } catch {
      notify('Wrong credentials, login failed', 'error')
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    userDispatch({type: 'CLEAR_USER'})
    notify('Logged out', 'success')
  }

  const handleLike = (blog) => {
    const updatedBlog = {
      ...blog,
      likes: blog.likes + 1,
      user: blog.user.id || blog.user
    }
    updateBlogMutation.mutate(updatedBlog)
  }

  const handleComment = (blog,comment) => {
    const updatedBlog = {
      ...blog,
      comments: blog.comments.concat(comment),
      user: blog.user.id || blog.user
    } 
    console.log(updatedBlog)
    commentBlogMutation.mutate(updatedBlog)
  }

  const handleDelete = async (blog) => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`))
      deleteBlogMutation.mutate(blog.id)

  }
  
  const blogMatch = useMatch('/blogs/:id')
  const resultBlog = useQuery({
    queryKey: ['blog', blogMatch ? blogMatch.params.id : null],
    queryFn: () => blogService.getOne(blogMatch.params.id),
    enabled: !!blogMatch, 
    retry: 1
  })
  const oneBlog = blogMatch ? resultBlog.data : null

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      userDispatch({type: 'SET_USER', payload: user})
      blogService.setToken(user.token)
    }
  }, [])

  if ( result.isLoading || resultBlog.isLoading )
    return <div>loading data...</div>


  const blogs = result.data  
  
  const sortedBlogs = [...blogs].sort((a, b) => b.likes - a.likes)

  if(user === null) {
    return (
      <div>
        <Notification />
        <Login
          username={username}
          password={password}
          usernameChangeHandler={({target}) => setUserName(target.value)}
          passwordChangeHandler={({target}) => setPassword(target.value)}
          handleLogin={handleLogin}
        />
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification />
      <div style={{marginBottom: 10}}>
        <ResponsiveAppBar handleLogout={handleLogout} />
      </div>

      <Routes>
        <Route path="/users" element={<Users />} />
        <Route path="/users/:username" element={<User />} />
        <Route path="/blogs/:id" element={
          oneBlog ? (
            <Blog 
              blog={oneBlog} 
              handleLike={() => handleLike(oneBlog)} 
              handleComment={handleComment} 
              handleDelete={() => handleDelete(oneBlog)} 
              user={user}
              className="single" 
            />
          ) : <div>loading...</div>
        } />
        <Route path="/" element={
          <div>
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
                className="list" 
              />
            )}
          </div>
        } />
      </Routes>
    </div>
  )
}

export default App