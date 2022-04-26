import * as React from "react";
//import { useEffect } from "react";
import { AppState, useSharedState } from "../states/AppState";
import { useNavigate } from 'react-router-dom';

import { Card, Row, Button } from 'react-bootstrap';

//import { CommunicationService } from "../services/CommunicationService";

export const Overview: React.FC = () => {

    const [appState, setAppState] = useSharedState();
    const navigate = useNavigate();

    let logout = () => {
        setAppState((prevState: AppState) => ({ ...prevState, userIsLoggedIn: false }));
    }

    let cards = ['Repositories', 'Features', 'Commits', 'Variants'];
    return (
        <>
            {cards.map((name, idx) => (

                <Card
                    border={'primary'}
                    key={idx}
                    text={'dark'}
                    style={{ width: '18rem', cursor: 'pointer' }}
                    className="overview-card mb-2 me-5"
                    onClick={() => navigate(`/${name.toLocaleLowerCase()}`)}
                >
                    <Card.Header as='h4'>{name}</Card.Header>
                    <Card.Body>
                        <Card.Text>
                            Some quick example text to build on the card title and make up the bulk
                            of the card's content. TODO
                        </Card.Text>
                    </Card.Body>
                </Card>
            ))
            }

            <Row>
                <Button onClick={logout}>Logout</Button>
            </Row>

        </>
    );
}
