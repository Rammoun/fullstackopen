const bloglistRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const express = require('express')

bloglistRouter.use(express.json())

bloglistRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

bloglistRouter.get('/:id', async (request,response)=>{
  const id=request.params.id
  const blog=await Blog.findById(id).populate('user',{username:1,name:1})
  if (blog) {
    response.json(blog)
  } else {
    response.status(404).end()
  }
})

bloglistRouter.post('/', async (request, response) => {
  const body = request.body
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }

  const user = await User.findById(decodedToken.id)
  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user.id
  })

  const savedBlog = await blog.save()
  
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  await savedBlog.populate('user', { username: 1, name: 1 })
  response.status(201).json(savedBlog)
})

bloglistRouter.delete('/:id', async (request, response) => {
  const user = request.user

  const blog = await Blog.findById(request.params.id)

  if (!blog) {
    return response.status(204).end()
  }

  if ( user.id.toString() !== blog.user.toString() ) {
    return response.status(401).json({ error: 'only the creator can delete blogs' })
  }

  await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end()
})

bloglistRouter.put('/:id', async (request, response) => {
  const body = request.body

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  }

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
  response.json(updatedBlog)
})

bloglistRouter.get('/:id/comments', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  if (!blog) {
    return response.status(404).json({ error: 'blog not found' })
  }
  const comments = blog.comments
  response.json(comments)
})

bloglistRouter.put('/:id/comments', async (request, response) => {
  const body = request.body
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  const blog={
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    comments: body.comments
  }
  
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }

  const user = await User.findById(decodedToken.id)
  if (!user) {
    return response.status(404).json({ error: 'user not found' })
  }  

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
  // blog.comments = blog.comments.concat(comment)
  // await blog.save()

  response.status(201).json(blog)
})

module.exports = bloglistRouter