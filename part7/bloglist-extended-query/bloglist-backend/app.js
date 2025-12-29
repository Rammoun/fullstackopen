const config = require('./utils/config')
const { info, error } = require('./utils/logger')
const middleware = require('./utils/middleware')
const bloglistRouter = require('./controllers/bloglist')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')

app.use(cors())
app.use(express.json())
app.use(middleware.tokenExtractor)
app.use('/api/blogs', middleware.userExtractor, bloglistRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

const mongoUrl = config.mongoUrl
mongoose.connect(mongoUrl, { family: 4 })
    .then(() => {
      info('connected to MongoDB')
  })
    .catch((err) => {
      error('error connecting to MongoDB:', err.message)
  })
  
if (process.env.NODE_ENV === 'test') {
  const testingRouter = require('./controllers/testing')
  app.use('/api/testing', testingRouter)
}
app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app