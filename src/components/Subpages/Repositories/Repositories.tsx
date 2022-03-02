import * as React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { AppState, useSharedState } from "../../../states/AppState";
import { CommunicationService } from "../../../services/CommunicationService";

import { Form, Button, ButtonToolbar, ButtonGroup, Container, Row, Col, Table, ListGroup } from 'react-bootstrap';

import { CreateRepoModal } from "./Repositories.CreateRepoModal";
import { DeleteRepoModal } from "./Repositories.DeleteRepoModal";

export const Repositories: React.FC = () => {

    const [appState, setAppState] = useSharedState();
    const [selectedRepo, setSelectedRepo] = useState<string>(null);

    let chooseRepo = () => {
        setAppState((prevState: AppState) => ({
            ...prevState,
            directory: selectedRepo
        }));
    }

    let deleteRepo = () => {
        console.log("deleting " + selectedRepo);
        // TODO Allert Modal
        let newArray = [...appState.availableRepositories].filter(el => el != selectedRepo)

        setAppState((prevState: AppState) => ({
            ...prevState,
            availableRepositories: newArray
        }));
        setSelectedRepo(null);
    }

    return (
        <Container>
            <Row>
                <legend>Choose Repository</legend>
            </Row>

            <Row>
                <Col>
                    <ListGroup>
                        {appState.availableRepositories.map((element, i) => {
                            return (
                                <ListGroup.Item key={i} action active={element == selectedRepo} onClick={() => setSelectedRepo(element)}>
                                    {element}
                                </ListGroup.Item>
                            )
                        })
                        }
                    </ListGroup>
                </Col>
                <Col>
                    <ButtonGroup vertical>
                        <ButtonGroup className="me-2 mb-2" vertical>
                            <DeleteRepoModal btnDisabled={selectedRepo == null} repo={null} />
                            <CreateRepoModal/>
                        </ButtonGroup>
                        <ButtonGroup vertical>
                            <Button variant="primary" type="submit" disabled={selectedRepo == null} onClick={chooseRepo}>Choose</Button>
                        </ButtonGroup>
                    </ButtonGroup>
                </Col>
            </Row>
       </Container>
    );
}


