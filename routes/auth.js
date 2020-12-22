const express = require('express')
const bcrypt = require('bcryptjs')
const config = require('config')
const jwt = require('jsonwebtoken')
const auth = require('../middleware/auth')
const { check, validationResult } = require('express-validator')

const router = express.Router()

const User = require('../models/User')

//@route GET /api/auth
//@desc Get logged in user
//@access Private
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password')
    res.json(user)
  } catch (error) {
    res.status(500).send('Server Error')
  }
})

//@route POST /api/auth
//@desc Auth user & get token
//@access Public
router.post(
  '/',
  [
    check('email', 'Please enter a valid email').isEmail(),
    check('password', 'Please enter at least 6 characters').isLength({
      min: 6,
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    const { email, password } = req.body
    try {
      let user = await User.findOne({ email })
      if (!user) {
        return res.status(400).json({ message: 'User not found' })
      }
      const isPasswordMatched = await bcrypt.compare(password, user.password)
      if (!isPasswordMatched) {
        return res.status(400).json({ message: 'Invalid credentials' })
      }
      const payload = {
        user: {
          id: user.id,
        },
      }

      jwt.sign(
        payload,
        config.get('jwtSecret'),
        {
          expiresIn: 360000,
        },
        (error, token) => {
          if (error) throw error
          res.json({ token })
        }
      )
    } catch (error) {
      res.status(500).send({ message: error.message })
    }
  }
)

module.exports = router
