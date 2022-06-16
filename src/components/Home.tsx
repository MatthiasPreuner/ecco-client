import * as React from "react";
import { useSharedState } from "../states/AppState";

import { Repositories } from "./Subpages/Repositories/Repositories";
import { Container } from 'react-bootstrap';
import { Overview } from "./Home.Overview";

import './Home.scss';

export const Home: React.FC = () => {

    const [appState, setAppState] = useSharedState();

    return (
        <Container className="vh-100 d-flex align-items-center justify-content-center">
            {appState.repository ? <Overview /> : <Repositories />}
        </Container>
    );
}
