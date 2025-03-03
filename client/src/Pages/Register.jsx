import React, { useContext } from 'react';
import { Alert, Button, Form, Row, Col, Stack } from 'react-bootstrap';
import { AuthContext } from '../Context/AuthContext';


const Register = () => {
  const { isRegisterLoading, registerInfo, updateRegister, registerUser,registerError } = useContext(AuthContext);

  return (
    <Form onSubmit={registerUser}>
      <Row
        style={{
          height: "100vh",
          justifyContent: "center",
          paddingTop: "10%",
        }}
      >
        <Col xs={6}>
          <Stack gap={3}>
            <h2>Register</h2>
            <Form.Control
              type="text"
              placeholder="Name"
              value={registerInfo.name} // Controlled component
              onChange={(e) => updateRegister({ ...registerInfo, name: e.target.value })}
            />
            <Form.Control
              type="email"
              placeholder="Email"
              value={registerInfo.email}
              onChange={(e) => updateRegister({ ...registerInfo, email: e.target.value })}
            />
            <Form.Control
              type="password"
              placeholder="Password"
              value={registerInfo.password}
              onChange={(e) => updateRegister({ ...registerInfo, password: e.target.value })}
            />
            <Button variant="primary" type="submit">
              {isRegisterLoading ? "Creating Your Account" : "Register"}
            </Button>
            {
              registerError?.error &&  <Alert variant="danger">
              <p>{registerError?.message}</p>
            </Alert>
            }
           
          </Stack>
        </Col>
      </Row>
    </Form>
  );
};

export default Register;
