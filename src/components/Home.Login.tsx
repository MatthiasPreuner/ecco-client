import * as React from "react";
import { useEffect } from "react";
import { AppState, useSharedState } from "../states/AppState";
import { CommunicationService } from "../services/CommunicationService";

import { Form, Button, Container, Row } from 'react-bootstrap';

export const Login: React.FC = () => {

    const [appState, setAppState] = useSharedState();

    let login = () => {
        setAppState((prevState: AppState) => ({
            ...prevState,
            userIsLoggedIn: true
        }));
    }

    return (
/*         <Container className="d-flex vh-100 justify-content-center align-items-center"> */
            <Form className="w-80">
                <legend>EccoHub Login</legend>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Control type="email" placeholder="email or username" />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Control type="password" placeholder="password" />
                </Form.Group>
                <Button variant="primary" type="submit" onClick={login}>Sign in</Button>
            </Form>
/*         </Container> */
    );
}


