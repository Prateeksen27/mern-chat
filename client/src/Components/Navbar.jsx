import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { Container, Nav, Navbar, Stack } from 'react-bootstrap'
import { AuthContext } from '../Context/AuthContext'
import Notification from './Notification'

const navbar = () => {
  const { user, logoutUser } = useContext(AuthContext)
  return (
    <Navbar bg="dark" className='mb-4' style={{ height: "3.75rem" }}>
      <Container>
        <h2 style={{ color: "white" }}>
          <Link to='/' className='link-light text-decoration-none'>
            ChatApp
          </Link>
        </h2>
        {user ? <span className='text-warning'>Logged in as {user.name}</span> : <span></span>}
        <Nav>

          <Stack direction='horizontal' gap={3}>
            {
              user &&
              <>
              <Notification />
                <Link onClick={() => logoutUser()} to='/login' className='link-light text-decoration-none'>
                  Logout
                </Link>
              </>
            }
            {
              !user &&
              <>
                <Link to='/login' className='link-light text-decoration-none'>
                  Login
                </Link>
                <Link to='/register' className='link-light text-decoration-none'>
                  Register
                </Link>
              </>
            }
          </Stack>

        </Nav>
      </Container>
    </Navbar>
  )
}

export default navbar