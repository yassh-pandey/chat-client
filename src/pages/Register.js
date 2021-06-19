import { useState } from "react";
import {
  Container, 
  Row, 
  Col,
  Form,
  Button,
  ListGroup,
  Alert,
} from "react-bootstrap";
import { gql, useMutation } from '@apollo/client';
import { Link } from "react-router-dom";
import AuthGuard from "../utils/AuthGuard";

const REGISTER_USER = gql`
  mutation registerUser(
    $userName: String!
    $email: String!
    $password: String!
    $confirmPassword: String!
    ) {
      registerUser(
        userName: $userName
        email: $email
        password: $password
        confirmPassword: $confirmPassword
        ) {
          userName
          email
          createdAt
    }
  }
`;


function Register(props) {

  const [registerFormState, setRegisterFormState] = useState({
    email: "",
    userName: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState(null);

  const [registerUser, { loading }] = useMutation(REGISTER_USER, {
    update: ()=>{
      setErrors(null);
      props.history.push("/login");
    },
    onError: (errors)=>{
      console.log(errors);
      if(errors?.graphQLErrors?.length>0){
        const err = errors?.graphQLErrors[0]?.extensions?.errors;
        if(err){
          setErrors(err);
        }
        else{
          setErrors({"sourceUnknown": "Opps! some error occured while trying to register the user."});
        }
      }
      else{
        setErrors({"sourceUnknown": "Opps! some error occured while trying to register the user."});
      }
    }
  });

  const submitRegisterForm = (e)=>{
    e.preventDefault();
    registerUser({
      variables: {
        ...registerFormState
      }
    });
  }

  const onInputChange = (e)=>{
    const key = e?.target?.id;
    const value = e?.target?.value;
    setRegisterFormState(cs=>({
      ...cs,
      [key]: value
    }))
  }
  return (
    <AuthGuard restrictAuthenticated={true} fallback="/">
      <Container>
        <Row className={"mt-5 justify-content-center"}>
          <Col sm={8} lg={6} className={"border bg-white py-5 rounded"}>
            <h1 className={"text-center"}>
              Register
            </h1>
            <Form onSubmit={submitRegisterForm}>
              <Form.Group controlId="email">
                <Form.Label className={
                  errors?.email && "text-danger"
                }>
                  {errors?.email ?? "Email address" }
                </Form.Label>
                <Form.Control 
                  type="email" placeholder="Enter email" 
                  value={registerFormState.email}
                  onChange={onInputChange}
                  className={errors?.email && "is-invalid"}
                />
              </Form.Group>
              <Form.Group controlId="userName">
                <Form.Label className={
                  errors?.userName && "text-danger"
                }>
                  {errors?.userName ?? "Username" }
                </Form.Label>
                <Form.Control type="text" 
                  placeholder="Enter username"
                  value={registerFormState.userName}
                  onChange={onInputChange}
                  className={errors?.userName && "is-invalid"}
                />
              </Form.Group>
              <Form.Group controlId="password">
                <Form.Label className={
                  errors?.password && "text-danger"
                }>
                  {errors?.password ?? "Password"}
                </Form.Label>
                <Form.Control type="password" placeholder="Password" 
                    value={registerFormState.password}
                    onChange={onInputChange}
                    className={errors?.password && "is-invalid"}
                />
              </Form.Group>
              {
                errors?.badPassword
                ?
                (
                  <>
                    <ListGroup className={"list-group-flush"}>
                      {
                        errors?.badPassword.map(err=>(
                          <ListGroup.Item 
                            key={err} 
                            className={"text-danger text-capitalize"}
                          >
                              {err}
                          </ListGroup.Item>
                        ))
                      }
                    </ListGroup>
                  </>
                )
                :
                null
              }
              <Form.Group controlId="confirmPassword">
                <Form.Label className={
                  errors?.confirmPassword && "text-danger" 
                }
                >
                  {errors?.confirmPassword ?? "Confirm Password"}
                </Form.Label>
                <Form.Control type="password" 
                  placeholder="Confirm Password" 
                  value={registerFormState.confirmPassword}
                  onChange={onInputChange}
                  className={errors?.confirmPassword && "is-invalid"}
                />
              </Form.Group>
              {
                errors?.sourceUnknown
                ?
                <Alert variant="danger">
                  {errors?.sourceUnknown}
                </Alert>
                :
                null
              }
              <div className="text-center">
                <Button variant="success" type="submit"
                  disabled={loading?true:false}
                >
                  {
                    loading
                    ?
                    "Wait..."
                    :
                    "Register"
                  }
                </Button>
              </div>
              <div className="text-center mt-4">
                  <small>
                      Already have an account? <Link to="/login">Login</Link>
                  </small>
              </div>
            </Form>
          </Col>
        </Row>
      </Container>
    </AuthGuard>
  );
}

export default Register;
