const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/user')

loginRouter.post('/', async (request, response) => {
  const { username, password } = request.body

  // 1. Search for the user in the DB
  const user = await User.findOne({ username })

  // 2. Check if user exists AND if the password matches the hash
  const passwordCorrect = user === null
    ? false
    : await bcrypt.compare(password, user.passwordHash)

  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      error: 'invalid username or password'
    })
  }

  // 3. Create the data we want to pack into the token
  const userForToken = {
    username: user.username,
    id: user._id,
  }

  // 4. Sign the token using your SECRET
  const token = jwt.sign(userForToken, process.env.SECRET)

  // 5. Send the token back to the browser
  response
    .status(200)
    .send({ token, username: user.username, name: user.name })
})

module.exports = loginRouter