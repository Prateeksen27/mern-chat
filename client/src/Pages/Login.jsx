import React, { useContext } from 'react'
import {Alert,Button,Form, Row,Col,Stack} from 'react-bootstrap'
import { AuthContext } from '../Context/AuthContext'
const login = () => {
  const { loginError,
    loginInfo,
    updateLogin,
    isLoginLoading,
    loginUser}=useContext(AuthContext)
  return (
   <>
   <Form onSubmit={loginUser}>
    <Row style={
      {
        height:"100vh",
        justifyContent:"center",
        paddingTop:"10%"
        
      }
    }>
      <Col xs={6}>
      <Stack gap={3}>
        <h2>Login</h2>
        <Form.Control type='email' placeholder='Email' onChange={(e)=>updateLogin({
          ...loginInfo,email:e.target.value
        })} />
        <Form.Control type='password' placeholder='Password' onChange={(e)=>{
          updateLogin({
            ...loginInfo,password : e.target.value
          })
        }} />
        <Button style={{
          width:"100px",
        
          }} variant='primary' type='submit' >
         { isLoginLoading ? "Loginng In" : "Login"}
        </Button>
       {
                     loginError?.error &&  <Alert variant="danger">
                     <p>{loginError?.message}</p>
                   </Alert>
                   }
      </Stack>
      </Col>
    </Row>
   </Form>
   </>
  )
}

export default login