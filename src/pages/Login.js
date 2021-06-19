import { useState } from "react";
import {
  Container, 
  Row, 
  Col,
  Form,
  Button,
  Alert,
} from "react-bootstrap";
import { gql, useLazyQuery } from '@apollo/client';
import { Link } from "react-router-dom";
import { useAuthDispatch } from "../context/auth";
import AuthGuard from "../utils/AuthGuard";

const LOGIN = gql`
  query login(
    $userName: String!
    $password: String!
    ) {
      login(
        userName: $userName
        password: $password
        ) {
          userName
          email
          token
    }
  }
`;


function Login(props) {

  const [loginFormState, setLoginFormState] = useState({
    userName: "",
    password: "",
  });

  const authDispatch = useAuthDispatch();

  const [login, { loading, error }] = useLazyQuery(LOGIN, {
      onCompleted: (data)=>{
          authDispatch({type: "LOGIN", payload: data?.login});
          props.history.push("/");
      }
  });

  const submitLoginForm = (e)=>{
    e.preventDefault();
    login({
      variables: {
        ...loginFormState
      }
    });
  }

  const onInputChange = (e)=>{
    const key = e?.target?.id;
    const value = e?.target?.value;
    setLoginFormState(cs=>({
      ...cs,
      [key]: value
    }))
  }
  return (
    <AuthGuard restrictAuthenticated={true} fallback={"/"}>
      <Container>
        <Row className={"mt-5 justify-content-center"}>
          <Col sm={8} lg={6} className={"border bg-white py-5 rounded"}>
            <h1 className={"text-center"}>
              Login
            </h1>
            <Form onSubmit={submitLoginForm}>
              <Form.Group controlId="userName">
                <Form.Label>
                  Username
                </Form.Label>
                <Form.Control type="text" 
                  placeholder="Enter username"
                  value={loginFormState.userName}
                  onChange={onInputChange}
                />
              </Form.Group>
              <Form.Group controlId="password">
                <Form.Label>
                  Password
                </Form.Label>
                <Form.Control type="password" placeholder="Password" 
                    value={loginFormState.password}
                    onChange={onInputChange}
                />
              </Form.Group>
              {
                  error
                  ?
                  <Alert variant="danger" className="text-center">
                      Username or Password is incorrect.
                  </Alert>
                  :
                  null
              }
              <div className="text-center">
                <Button variant="primary" type="submit"
                  disabled={loading?true:false}
                >
                  {
                    loading
                    ?
                    "Wait..."
                    :
                    "Login"
                  }
                </Button>
              </div>
              <div className="text-center mt-4">
                  <small>
                      Don't have an account? <Link to="/register">Register</Link>
                  </small>
              </div>
            </Form>
          </Col>
        </Row>
      </Container>
    </AuthGuard>
  );

}

export default Login;
