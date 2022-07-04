import * as React from "react";
import { AppState, useSharedState } from "../states/AppState";
import { useNavigate } from 'react-router-dom';

import { Card, Row, Button, Container, Col } from 'react-bootstrap';

import { CommunicationService } from "../services/CommunicationService";


export const Overview: React.FC = () => {

    const [appState, setAppState] = useSharedState();
    const navigate = useNavigate();

    let logout = () => {
        CommunicationService.getInstance().logout();
        setAppState((prevState: AppState) => ({ ...prevState, loggedUserName: null, repository: null, availableRepositories: null }));
    }

    let cards = new Map<string, string>([
        ['Repositories', 'Create, clone, delete and select repositories.'],
        ['Features', 'View features and edit feature and feature revision description.'],
        ['Commits', 'View, compare and make new commits.'],
        ['Variants', 'View, create, edit and checkout variants.']]);
    return (
        <>
            <Container className="main d-flex pt-4 justify-content-center">
                <Col>
                    <Row className="align-items-center" style={{height: '80vh'}}>
                        {Array.from(cards).map(([name, info], idx) => (
                            <Col key={idx}>
                                <Card
                                    border={'primary'}
                                    key={idx}
                                    text={'dark'}
                                    style={{ width: '18rem', cursor: 'pointer' }}
                                    className="overview-card mb-2"
                                    onClick={() => navigate(`/${name.toLocaleLowerCase()}`)}
                                >
                                    <Card.Header as='h4'>{name}</Card.Header>
                                    <Card.Body>
                                        <Card.Text>{info}</Card.Text>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))
                        }
                    </Row>
                    <Row className="justify-content-md-center">
                        <Col md="auto">
                            <Button onClick={logout}>Logout</Button>
                        </Col>
                    </Row>
                </Col>
            </Container>
        </>
    );
}
