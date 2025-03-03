import { useContext, useState } from 'react'
import './App.css'
import {Routes,Route,Navigate} from 'react-router-dom'
import "bootstrap/dist/css/bootstrap.min.css"
import {Container} from 'react-bootstrap'
import Login from './pages/login'
import Register from './pages/register'
import Chat from './pages/Chat'
import Navbar from './Components/Navbar'
import { AuthContext } from './Context/AuthContext'
import { ChatContextProvider } from './Context/chatContext'
function App() {
  const {user} = useContext(AuthContext)

  return (
    <ChatContextProvider user = {user}>
    <Navbar />
    <Container>
    <Routes>
      <Route path='/' element={user ? <Chat /> : <Login />} /> 
      <Route path='/login' element={user ? <Chat /> : <Login />} />
      <Route path='/register' element={user ? <Chat /> : <Register />} />
      <Route path='*' element={<Navigate to='/' />} />
    </Routes>
    </Container>
    </ChatContextProvider>
  )
}

export default App
