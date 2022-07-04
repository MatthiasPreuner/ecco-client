import * as React from "react";

import { Container } from 'react-bootstrap';
import { Overview } from "./Home.Overview";

import './Home.scss';

export const Home: React.FC = () => {
    return (
        <Container className="vh-100 d-flex align-items-center justify-content-center">
            <Overview />
        </Container>
    );
}
