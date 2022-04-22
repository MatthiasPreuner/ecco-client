import * as React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { AppState, useSharedState } from "../../../states/AppState";
import { CommunicationService } from "../../../services/CommunicationService";

import { Button, ButtonGroup, Container, Row, Col, ListGroup } from 'react-bootstrap';

import { CreateRepoModal } from "./Repositories.CreateRepoModal";
import { DeleteRepoModal } from "./Repositories.DeleteRepoModal";
import { RepositoryResponse } from "../../../model/RepositoryResponse";
import { CloneRepoModal } from "./Repositories.CloneRepoModal";
import { RepositoryHeaderModel } from "../../../model/RepositoryModel";
import { RepositoryHeaderResponse } from "../../../model/AvailableRepositoryResponse";

export const Repositories: React.FC = () => {

    const [appState, setAppState] = useSharedState();
    const [selectedRepo, setSelectedRepo] = useState<RepositoryHeaderModel>(null);

    useEffect(() => {
        refresh();
    }, []);

    let refresh = () => {
        CommunicationService.getInstance().getAllRepositories().then((apiData: RepositoryHeaderResponse) => {
            setAppState((previousState) => ({
                ...previousState,
                availableRepositories: apiData.data
            }));
        });
    }

    let chooseRepo = () => {
        CommunicationService.getInstance().getRepository(selectedRepo).then((apiData: RepositoryResponse) => {
            setAppState((previousState) => ({
                ...previousState,
                repository: apiData.data
            }));
        });
    }

    return (
        <Container className="main d-flex pt-4 justify-content-center">
            <Col>
                <Row>
                    <h3>Repositories</h3>
                </Row>
                <Row>
                    <Col xs={8}>
                        <ListGroup style={{ maxHeight: '80vh' }}> {/* TODO calc height */}
                            {appState.availableRepositories?.map((repo: RepositoryHeaderModel, i) => {
                                return (
                                    <ListGroup.Item key={i} action active={repo === selectedRepo} onClick={() => setSelectedRepo(repo)}>{repo.rid == appState.repository?.rid && <i className="bi bi-dot"></i>} {repo.name}</ListGroup.Item>
                                )
                            })}
                        </ListGroup>
                    </Col>
                    <Col>
                        <ButtonGroup vertical>
                            <ButtonGroup className="me-2 mb-2 w-100" vertical><CreateRepoModal /></ButtonGroup>
                            <ButtonGroup className="me-2 mb-2 w-100" vertical><CloneRepoModal repo={selectedRepo} /></ButtonGroup>
                            <ButtonGroup className="me-2 mb-2 w-100" vertical><DeleteRepoModal repo={selectedRepo} /></ButtonGroup>
                            <ButtonGroup className="me-2 mb-2 w-100" vertical><Button variant="primary" type="submit" disabled={selectedRepo == null} onClick={chooseRepo}>Select</Button></ButtonGroup>
                            <ButtonGroup className="me-2 mb-2 w-100" vertical><Button onClick={refresh}><i className="bi bi-arrow-clockwise"></i></Button></ButtonGroup>
                        </ButtonGroup>
                    </Col>
                </Row>
            </Col>
        </Container>
    );
}


