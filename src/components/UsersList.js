import React from 'react'
import {
    ListGroup
} from "react-bootstrap";
function UsersList({users}) {
    return (
        <ListGroup>
            {
                users.map(user=>(
                    <ListGroup.Item key={user?.userName}>{user?.userName}</ListGroup.Item>
                ))
            }
        </ListGroup>
    )
}

export default UsersList
