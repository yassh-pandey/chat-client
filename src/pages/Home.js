import {
    Container,
    Row,
    Col,
    Button,
    Alert,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import { useAuthDispatch } from "../context/auth";
import AuthGuard from "../utils/AuthGuard";
import Spinner from '@atlaskit/spinner';
import UsersList from "../components/UsersList";

import {
    gql,
    useQuery,
} from "@apollo/client";

const GET_USERS = gql`
    query getUsers{
        getUsers{
            userName
            email
            createdAt
        }
    }
`;

function Home({history}) {

    const authDispatch = useAuthDispatch();
    const { loading, error, data } = useQuery(GET_USERS);

    const handleLogout = ()=>{
        authDispatch({type: "LOGOUT"});
        history.push("/login");
    }
    return (
        <AuthGuard fallback="/login">
            <Container>
                {
                    loading || error
                    ?
                    <Row className="min-vh-100">
                        <Col xs={12} className="d-flex justify-content-center align-items-center">
                            <Spinner size="xlarge"/>
                        </Col>
                    </Row>
                    :
                    <>
                        <Row className={"bg-white py-2 mt-3 mx-3 mx-sm-0"}>
                            <Col className={"text-center"}>
                                <Link to="/login">
                                    <Button variant="link">
                                        Login
                                    </Button>
                                </Link>
                            </Col>
                            <Col className={"text-center"}>
                                <Link to="/register">
                                    <Button variant="link">
                                        Register
                                    </Button>
                                </Link>
                            </Col>
                            <Col className={"text-center"}>
                                <Button variant="link" onClick={handleLogout}>
                                    Logout
                                </Button>
                            </Col>
                        </Row>
                        <Row className="bg-white py-2 mt-3 mx-3 mx-sm-0">
                            <Col xs={4}>
                                {
                                    data.getUsers.length===0
                                    ?
                                    <Alert variant="primary">
                                        No users to chat with :(
                                    </Alert>
                                    :
                                    <UsersList users={data.getUsers} />
                                }
                            </Col>
                            <Col xs={8}>
                                <h3>
                                    Messages
                                </h3>
                            </Col>
                        </Row>
                    </>

                }
            </Container>
        </AuthGuard>
    )
}

export default Home
