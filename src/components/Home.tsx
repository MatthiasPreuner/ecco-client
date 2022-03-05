import * as React from "react";
import { useEffect } from "react";
import { AppState, useSharedState } from "../states/AppState";

import { CommunicationService } from "../services/CommunicationService";
/* import { OperationResponse } from "../Domain/Model/Backend/OperationResponse"; */

import { Login } from "./Home.Login";
import { Repositories } from "./Subpages/Repositories/Repositories";
import { Container, Col } from 'react-bootstrap';

export const Home: React.FC = () => {

    const [appState, setAppState] = useSharedState();

  /*   useEffect(() => {
        if (appState.directory != "" && appState.repoOperation != "") {
            CommunicationService.getInstance().doOpenCloseRepositoryWithDirectory(appState.directory, appState.repoOperation).then((apiData: OperationResponse) => {
                setAppState((previousState: AppState) => ({
                    ...previousState,
                    eccoServiceIsInitialized: apiData.data.eccoServiceIsInitialized,
                    plugins: apiData.data.artifactPlugins,
                    repoOperation: ""
                }));
            });
        }
    }, [appState.directory, appState.repoOperation]) */

    return (
        <Container className="vh-100 d-flex align-items-center justify-content-center">
           {/*  <Col> */}
            {!appState.userIsLoggedIn && <Login />}
            {appState.userIsLoggedIn && appState.directory == "" && <Repositories />}
      {/*       </Col> */}
        </Container>
    );
}
