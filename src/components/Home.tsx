import * as React from "react";
import { useEffect } from "react";
import { AppState, useSharedState } from "../states/AppState";

import { CommunicationService } from "../services/CommunicationService";

import { Login } from "./Home.Login";
import { Repositories } from "./Subpages/Repositories/Repositories";
import { Container } from 'react-bootstrap';
import { Overview } from "./Home.Overview";

import './Home.scss';

export const Home: React.FC = () => {

    const [appState, setAppState] = useSharedState();


    return (
        <Container className="vh-100 d-flex align-items-center justify-content-center">
            {!appState.userIsLoggedIn && <Login />}
            {appState.userIsLoggedIn && appState.repository == null && <Repositories />}
            {appState.userIsLoggedIn && appState.repository !== null && <Overview />}
        </Container>
    );
}
