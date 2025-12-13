const _ = require('lodash')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) return null
  return blogs.reduce((max, blog) => (blog.likes > max.likes ? blog : max))
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) return null

  const authorCounts = _.countBy(blogs, 'author')
  
  const topAuthor = _.maxBy(Object.keys(authorCounts).map(author => ({
    author: author,
    blogs: authorCounts[author]
  })), 'blogs')

  return topAuthor
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) return null

  const groupedPlugins = _.groupBy(blogs, 'author')
  
  const topAuthor = _.maxBy(Object.keys(groupedPlugins).map(author => {
    const likes = groupedPlugins[author].reduce((sum, blog) => sum + blog.likes, 0)
    return { author, likes }
  }), 'likes')

  return topAuthor
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}