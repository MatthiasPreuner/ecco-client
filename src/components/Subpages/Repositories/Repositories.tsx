import * as React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useSharedState } from "../../../states/AppState";
import { CommunicationService } from "../../../services/CommunicationService";

import { Button, ButtonGroup, Container, Row, Col, ListGroup, InputGroup, FormControl } from 'react-bootstrap';

import { CreateRepoModal } from "./Repositories.CreateRepoModal";
import { DeleteRepoModal } from "./Repositories.DeleteRepoModal";
import { ForkRepoModal } from "./Repositories.ForkRepoModal";
import { RepositoryResponse } from "../../../model/RepositoryResponse";
import { CloneRepoModal } from "./Repositories.CloneRepoModal";
import { RepositoryHeaderModel } from "../../../model/RepositoryModel";
import { RepositoryHeaderResponse } from "../../../model/AvailableRepositoryResponse";
import { LoadingButton } from "../../common/LoadingButton";
import { AxiosError } from "axios";
import { ErrorResponseToast } from "../../common/ErrorResponseToast";

export const Repositories: React.FC = () => {

    const [appState, setAppState] = useSharedState();
    const [selectedRepo, setSelectedRepo] = useState<RepositoryHeaderModel>(null);
    const [repositoryFilterText, setRepositoryFilterText] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [choosing, setChoosing] = useState<boolean>(false);
    const [errorResponse, setErrorResponse] = useState<AxiosError>();

    useEffect(() => {
        if (appState.loggedUserName && !appState.availableRepositories) //
            refresh()
    }, [appState.availableRepositories]);

    let refresh = () => {
        setLoading(true)
        CommunicationService.getInstance().getAllRepositories().then((apiData: RepositoryHeaderResponse) => {
            setAppState((previousState) => ({ ...previousState, availableRepositories: apiData.data }));
            setErrorResponse(undefined);
            setLoading(false)
        }, (e: AxiosError) => {
            setErrorResponse(e);
            setLoading(false);
        });
    }

    let chooseRepo = () => {
        setChoosing(true)
        CommunicationService.getInstance().getRepository(selectedRepo).then((apiData: RepositoryResponse) => {
            setAppState((previousState) => ({ ...previousState, repository: apiData.data }));
            setErrorResponse(undefined);
            setChoosing(false)
        }, (e: AxiosError) => {
            setErrorResponse(e);
            setChoosing(false);
        });
    }

    const getCurrentRepositoryExpression = (): JSX.Element[] => {

        if (!appState.availableRepositories) { // still loading
            return [(<></>)]
        }

        if (appState.availableRepositories.length === 0) {
            return [(<i>There are no Repositories yet.</i>)]
        }

        let filteredRepositories = appState.availableRepositories?.filter(r => r.name.toLowerCase().includes(repositoryFilterText.toLowerCase()))

        if (filteredRepositories.length === 0) {
            return [(<i>Please consider using a different filter condition. There are no results.</i>)]
        }

        return filteredRepositories.map((repository: RepositoryHeaderModel, i) => {
            return (
                <ListGroup.Item key={'l' + i} action active={repository === selectedRepo} onClick={() => setSelectedRepo(repository)}>{repository.rid === appState.repository?.rid && <i className="bi bi-dot"></i>} {repository.name}</ListGroup.Item>
            );
        })
    }
    let repositories = getCurrentRepositoryExpression();

    return (
        <Container key={"c0"} className="main d-flex pt-4 justify-content-center">
            <Col key={"col0"} >
                <Row key={"r0"}>
                    <h3>Repositories</h3>
                </Row>
                <Row key={"r1"}>
                    <Col xs={10} key={'c0'}>
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
                            {repositories}
                        </ListGroup>
                        <ErrorResponseToast error={errorResponse} />
                    </Col >
                    <Col className="d-flex flex-column justify-content-between" key={'c1'}>
                        <ButtonGroup key={"bg1"} vertical className="w-100 mb-5">
                            <ButtonGroup key={"bg1.0"} className="me-2 mb-2 w-100" vertical><CreateRepoModal /></ButtonGroup>
                            <ButtonGroup key={"bg1.1"} className="me-2 mb-2 w-100" vertical><CloneRepoModal repo={selectedRepo} /></ButtonGroup>
                            <ButtonGroup key={"bg1.2"} className="me-2 mb-2 w-100" vertical><ForkRepoModal repo={selectedRepo} /></ButtonGroup>
                            <ButtonGroup key={"bg1.3"} className="me-2 mb-2 w-100" vertical><DeleteRepoModal repo={selectedRepo} /></ButtonGroup>
                        </ButtonGroup>
                        <ButtonGroup key={"bg2"} vertical className="w-100">
                            <ButtonGroup key={"bg2.0"} className="me-2 mb-2 w-100" vertical>
                                <LoadingButton
                                    loading={choosing}
                                    variant="primary"
                                    type="submit"
                                    disabled={selectedRepo === null || selectedRepo.rid === appState.repository?.rid}
                                    onClick={chooseRepo}>Select</LoadingButton>
                            </ButtonGroup>
                            <ButtonGroup key={"bg2.1"} className="me-2 mb-2 w-100" vertical>
                                <LoadingButton loading={loading} hideContentWhileLoading onClick={refresh}><i className="bi bi-arrow-clockwise" /> </LoadingButton>
                            </ButtonGroup>
                        </ButtonGroup>
                    </Col>
                </Row>
            </Col>
        </Container>
    );
}


