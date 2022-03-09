import * as React from "react";
import { useSharedState } from "../states/AppState";
import { useEffect, useState } from "react";

import { Container, Col, Row, InputGroup, FormControl, Button, Card, Accordion, Form, ListGroup } from 'react-bootstrap';

interface SubpageHeaderProps {
    title?: string,
/*     children?: React.ReactNode */
}

export const SubpageHeader: React.FC<SubpageHeaderProps> = props => {

    const [appState, setAppState] = useSharedState();

    return (
        <Container className="main d-flex pt-4 justify-content-center">
            <Col>
                <Row><h3>{props.title}</h3></Row>
                {appState.repository == null ?
                    <Row><p>No Repository selected.</p></Row> :

                    { props.children }
                }
            </Col>
        </Container >)
}