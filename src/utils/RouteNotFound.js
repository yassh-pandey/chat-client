import React from 'react'
import {
    Container,
    Row,
    Col,
    Alert,
} from "react-bootstrap";
function RouteNotFound() {
    return (
        <Container className="min-vh-100">
            <Row className="vh-100 d-flex justify-content-center align-items-center">
                <Col xs={12} md={6}>
                    <Alert variant="danger" className={"text-center p-md-5 rounded-lg h3"}>
                        Oops, the route you are requesting can't be found.
                    </Alert>
                </Col>
            </Row>
        </Container>
    )
}

export default RouteNotFound
