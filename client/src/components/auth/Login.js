import React, { useState, useContext, useEffect } from 'react'
import AuthContext from '../../context/auth/authContext'
import AlertContext from '../../context/alert/alertContext'

const Login = ({ history }) => {
  const authContext = useContext(AuthContext)
  const alertContext = useContext(AlertContext)

  const { loginUser, error, clearErrors, isAuthenticated } = authContext
  const { setAlert } = alertContext

  useEffect(() => {
    if (isAuthenticated) {
      history.push('/')
    }
    if (error) setAlert(error, 'danger')
    clearErrors()
    // eslint-disable-next-line
  }, [error, history, isAuthenticated])
  const [user, setUser] = useState({
    email: '',
    password: '',
  })

  const { email, password } = user

  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (email === '' || password === '') {
      setAlert('Please enter all fields', 'danger')
    } else {
      loginUser({
        email,
        password,
      })
    }
  }
  return (
    <div className='form-container'>
      <h1>
        Account <span className='text-primary'>Login</span>
      </h1>
      <form onSubmit={handleSubmit}>
        <div className='form-group'>
          <label htmlFor='email'>Email Address</label>
          <input
            type='email'
            name='email'
            value={email}
            onChange={handleChange}
            required
          />
        </div>
        <div className='form-group'>
          <label htmlFor='password'>Password</label>
          <input
            type='password'
            name='password'
            value={password}
            onChange={handleChange}
            required
          />
        </div>
        <input
          type='submit'
          value='Login'
          className='btn btn-primary btn-block'
        />
      </form>
    </div>
  )
}

export default Login
