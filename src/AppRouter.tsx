import * as React from "react";
import { useState, useEffect } from "react";
import { AppState, useSharedState } from "./states/AppState";
import { Link, Routes, Route } from "react-router-dom";
import { Nav, Navbar, Container, NavDropdown } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

import { Home } from "./components/Home";
import { Repositories } from "./components/Subpages/Repositories/Repositories";
import { Feature } from "./components/Subpages/Features/Feature";
import { Commits } from "./components/Subpages/Commits/Commits";
import { Variants } from "./components/Subpages/Variants/Variants";
import { RepositoryHeaderModel } from "./model/RepositoryModel";
import { CommunicationService } from "./services/CommunicationService";
import { RepositoryResponse } from "./model/RepositoryResponse";
import { Login } from "./components/Subpages/Login/Login";


export const AppRouter: React.FC = () => {

    const [appState, setAppState] = useSharedState();
    const [expanded, setExpanded] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        if (!appState.loggedUserName) {
            navigate(`/login`)
        } else {
            navigate(`/repositories`)
        }
    }, [appState.loggedUserName]);

    let logout = () => {
        CommunicationService.getInstance().logout();
        setAppState((prevState: AppState) => ({ ...prevState, loggedUserName: null, repository: null, availableRepositories: null }));
    }

    let chooseRepo = (repo: RepositoryHeaderModel) => {
        CommunicationService.getInstance().getRepository(repo).then((apiData: RepositoryResponse) => {
            setAppState((previousState) => ({ ...previousState, repository: apiData.data }));
        });
        setExpanded(false);
    }

    return (
        <>
            <Navbar bg="light" expand="lg" fixed="top" expanded={expanded}>
                <Container>
                    <Navbar.Brand type="button" onClick={() => navigate(`/home`)}>EccoHub</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" onClick={() => setExpanded(expanded ? false : true)} />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            {appState.loggedUserName && appState.repository && <>
                                <NavDropdown title={'Repository: ' + appState.repository.name} id="basic-nav-dropdown" >
                                    {appState.availableRepositories?.filter(e => e.name !== appState.repository.name).map((element, i) => {
                                        return (
                                            <NavDropdown.Item key={i} onClick={() => chooseRepo(element)}>{element.name}</NavDropdown.Item>
                                        )
                                    })
                                    }
                                    {(appState.availableRepositories.length > 1) && < NavDropdown.Divider />}
                                    <NavDropdown.Item onClick={() => setExpanded(false)} as={Link} to="repositories">Repository Overview</NavDropdown.Item>
                                </NavDropdown>
                                <Nav.Link onClick={() => setExpanded(false)} data-bs-target=".navbar-collapse.show" as={Link} to="features" disabled={appState.repository === null}>Features</Nav.Link>
                                <Nav.Link onClick={() => setExpanded(false)} as={Link} to="commits" disabled={appState.repository === null}>Commits</Nav.Link>
                                <Nav.Link onClick={() => setExpanded(false)} as={Link} to="variants" disabled={appState.repository === null}>Variants</Nav.Link>
                            </>}
                        </Nav>
                        {appState.loggedUserName &&
                            <Nav>
                                <NavDropdown title={"User: " + appState.loggedUserName} id="basic-nav-dropdown">
                                    {/* not implemented
                                    <NavDropdown.Item onClick={() => setExpanded(false)} as={Link} to="">Account Settings</NavDropdown.Item>
                                    <NavDropdown.Divider /> */}
                                    <NavDropdown.Item as={Link} to="/login" onClick={logout}>Logout</NavDropdown.Item>
                                </NavDropdown>
                            </Nav>
                        }
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/home" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/features" element={<Feature />} />
                <Route path="/repositories" element={<Repositories />} />
                <Route path="/commits" element={<Commits />} />
                <Route path="/variants" element={<Variants />} />
            </Routes>
        </>
    );

};

