const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

describe('total likes', () => {
  const listWithOneBlog = [
    {
        _id: "5a422a851b54a676234d17f7",
        title: "React patterns",
        author: "Michael Chan",
        url: "https://reactpatterns.com/",
        likes: 7,
        __v: 0
    }
  ]

const listWithThreBlogs = [
    {
        _id: "5a422a851b54a676234d17f7",
        title: "React patterns",
        author: "Michael Chan",
        url: "https://reactpatterns.com/",
        likes: 7,
        __v: 0
    },
    {
        _id: "5a422aa71b54a676234d17f8",
        title: "Go To Statement Considered Harmful",
        author: "Edsger W. Dijkstra",
        url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
        likes: 5,
        __v: 0
    },
    {
        _id: "5a422b3a1b54a676234d17f9",
        title: "Canonical string reduction",
        author: "Edsger W. Dijkstra",
        url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
        likes: 12,
        __v: 0
    }  
  ]

  test('dummy returns one', () => {
    const blogs = []

    const result = listHelper.dummy(blogs)
    assert.strictEqual(result, 1)
  })

  test('when list has only one blog, equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithOneBlog)
    assert.strictEqual(result, 7)
  })

  test('when list has many blogs, equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithThreBlogs)
    assert.strictEqual(result, 24)
  })
})

describe('favorite blog', () => {
  const blogs = [
    {
      _id: "5a422a851b54a676234d17f7",
      title: "React patterns",
      author: "Michael Chan",
      likes: 7,
      __v: 0
    },
    {
      _id: "5a422aa71b54a676234d17f8",
      title: "Go To Statement Considered Harmful",
      author: "Edsger W. Dijkstra",
      likes: 5,
      __v: 0
    },
    {
      _id: "5a422b3a1b54a676234d17f9",
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      likes: 12,
      __v: 0
    }
  ]

  test('returns the blog with the most likes', () => {
    const result = listHelper.favoriteBlog(blogs)
    
    assert.deepStrictEqual(result, {
      _id: "5a422b3a1b54a676234d17f9",
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      likes: 12,
      __v: 0
    })
  })
})

describe('most blogs', () => {
  const blogs = [
    { author: "Robert C. Martin", title: "Type wars", likes: 2 },
    { author: "Robert C. Martin", title: "Clean Code", likes: 5 },
    { author: "Edsger W. Dijkstra", title: "Canonical string reduction", likes: 12 }
  ]

  test('returns author with most blogs', () => {
    const result = listHelper.mostBlogs(blogs)
    assert.deepStrictEqual(result, {
      author: "Robert C. Martin",
      blogs: 2
    })
  })
})

describe('most likes', () => {
  const blogs = [
    { author: "Robert C. Martin", title: "Type wars", likes: 2 },
    { author: "Robert C. Martin", title: "Clean Code", likes: 5 },
    { author: "Edsger W. Dijkstra", title: "Canonical string reduction", likes: 12 }
  ]

  test('returns author with most total likes', () => {
    const result = listHelper.mostLikes(blogs)
    assert.deepStrictEqual(result, {
      author: "Edsger W. Dijkstra",
      likes: 12
    })
  })
})