import * as React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { AppState, useSharedState } from "../../../states/AppState";
import { CommunicationService } from "../../../services/CommunicationService";
import { useNavigate } from 'react-router-dom';

import { Button, ButtonGroup, Container, Row, Col, ListGroup, InputGroup, FormControl } from 'react-bootstrap';

import { CreateRepoModal } from "./Repositories.CreateRepoModal";
import { DeleteRepoModal } from "./Repositories.DeleteRepoModal";
import { RepositoryResponse } from "../../../model/RepositoryResponse";
import { CloneRepoModal } from "./Repositories.CloneRepoModal";
import { RepositoryHeaderModel } from "../../../model/RepositoryModel";
import { RepositoryHeaderResponse } from "../../../model/AvailableRepositoryResponse";

export const Repositories: React.FC = () => {

    const [appState, setAppState] = useSharedState();
    const [selectedRepo, setSelectedRepo] = useState<RepositoryHeaderModel>(null);
    const [repositoryFilterText, setRepositoryFilterText] = useState<string>("");

    const navigate = useNavigate();

    useEffect(() => {
        if (!appState.userIsLoggedIn) {
            navigate(`/`)
        } else {
            refresh();
        }
    }, [appState.userIsLoggedIn]);

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

    const getCurrentRepositoryExpression = (): JSX.Element[] => {
        return appState.availableRepositories?.map((repository: RepositoryHeaderModel, i) => {
            if (repository.name.toLowerCase().includes(repositoryFilterText.toLowerCase())) {
                return (
                    <ListGroup.Item key={i} action active={repository === selectedRepo} onClick={() => setSelectedRepo(repository)}>{repository.rid === appState.repository?.rid && <i className="bi bi-dot"></i>} {repository.name}</ListGroup.Item>
                );
            }
        }).filter((singleJSXElement: JSX.Element) => {
            return singleJSXElement !== undefined || singleJSXElement != null;
        });
    }
    let repositories = getCurrentRepositoryExpression();


    return (
        <Container className="main d-flex pt-4 justify-content-center">
            <Col>
                <Row>
                    <h3>Repositories</h3>
                </Row>
                <Row>
                    <Col xs={8}>
                        <Row>
                            <InputGroup className="mb-3">
                                <InputGroup.Text><i className="bi bi-funnel-fill"></i></InputGroup.Text>
                                <FormControl
                                    placeholder="Repositoryname for filtering..."
                                    onChange={e => setRepositoryFilterText(e.target.value)}
                                    value={repositoryFilterText}
                                />
                                {repositoryFilterText.length > 0 ? <Button variant="outline-primary" onClick={() => setRepositoryFilterText("")}><i className="bi bi-x"></i></Button> : null}
                            </InputGroup>
                        </Row>

                        <ListGroup className="my-4" style={{ maxHeight: 'calc(100vh - 250px)' }}>
                            {appState.availableRepositories.length === 0 ?
                                <p>There are no Repositories yet.</p> :
                                repositories.length === 0 ?
                                    <p>Please consider using a different filter condition. There are no results.</p> :
                                    repositories}
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


