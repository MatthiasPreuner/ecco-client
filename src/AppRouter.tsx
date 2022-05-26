import * as React from "react";
import { useState } from "react";
import { AppState, useSharedState } from "./states/AppState";
import { BrowserRouter, Link, Routes, Route } from "react-router-dom";
import { Nav, Navbar, Container, NavDropdown } from 'react-bootstrap';

import { Home } from "./components/Home";
import { Repositories } from "./components/Subpages/Repositories/Repositories";
import { Feature } from "./components/Subpages/Features/Feature";
import { Commits } from "./components/Subpages/Commits/Commits";
/* import { Artifact } from "./old/Artifact";
import { Association } from "./old/Association"; */
import { Variants } from "./components/Subpages/Variants/Variants";
import { RepositoryHeaderModel } from "./model/RepositoryModel";
import { CommunicationService } from "./services/CommunicationService";
import { RepositoryResponse } from "./model/RepositoryResponse";


export const AppRouter: React.FC = () => {

    const [appState, setAppState] = useSharedState();
    const [expanded, setExpanded] = useState(false);

    let logout = () => {
        setAppState((prevState: AppState) => ({
            ...prevState,
            userIsLoggedIn: false,
        }));
    }

    let chooseRepo = (repo: RepositoryHeaderModel) => {
        CommunicationService.getInstance().getRepository(repo).then((apiData: RepositoryResponse) => {
            setAppState((previousState) => ({ ...previousState, repository: apiData.data }));
        });
        setExpanded(false);
    }

    return (
        <BrowserRouter>
            <Navbar bg="light" expand="lg" fixed="top" expanded={expanded}>
                <Container>
                    <Navbar.Brand href="/">EccoHub</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" onClick={() => setExpanded(expanded ? false : true)} />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            {appState.userIsLoggedIn && <Nav.Link onClick={() => setExpanded(false)} as={Link} to="/">Home</Nav.Link>}
                            {appState.userIsLoggedIn && appState.repository !== null &&
                                <>
                                    <Nav.Link onClick={() => setExpanded(false)} data-bs-target=".navbar-collapse.show" as={Link} to="features" disabled={appState.repository === null}>Features</Nav.Link>
                                    <Nav.Link onClick={() => setExpanded(false)} as={Link} to="commits" disabled={appState.repository === null}>Commits</Nav.Link>
                                    <Nav.Link onClick={() => setExpanded(false)} as={Link} to="variants" disabled={appState.repository === null}>Variants</Nav.Link>
                                    {/*    <Nav.Link as={Link} to="artifacts" disabled={!appState.eccoServiceIsInitialized}>Artif acts</Nav.Link>
                                    <Nav.Link as={Link} to="associations" disabled={!appState.eccoServiceIsInitialized}>Associations</Nav.Link> */}
                                </>
                            }
                        </Nav>
                        <Nav>
                            {appState.userIsLoggedIn && appState.repository !== null &&
                                <NavDropdown title={'Repository: ' + appState.repository.name} id="basic-nav-dropdown" >
                                    {appState.availableRepositories?.filter(e => e.name !== appState.repository.name).map((element, i) => {
                                        return (
                                            <NavDropdown.Item key={i} onClick={() => chooseRepo(element)}>{element.name}</NavDropdown.Item>
                                        )
                                    })
                                    }
                                    {(appState.availableRepositories.length > 1) && < NavDropdown.Divider />}
                                    <NavDropdown.Item onClick={() => setExpanded(false)} as={Link} to="repositories">Repository Settings</NavDropdown.Item>
                                </NavDropdown>
                            }
                            {appState.userIsLoggedIn ?
                                <NavDropdown title={"User Name"} id="basic-nav-dropdown">
                                    <NavDropdown.Item onClick={() => setExpanded(false)} as={Link} to="">Account TODO</NavDropdown.Item>
                                    <NavDropdown.Divider />
                                    <NavDropdown.Item as={Link} to="/" onClick={logout}>Logout</NavDropdown.Item>
                                </NavDropdown> : null
                            }
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/features" element={<Feature />} />
                <Route path="/repositories" element={<Repositories />} />
                <Route path="/commits" element={<Commits />} />
                {/* <Route path="/artifacts" element={<Artifact />} />
                <Route path="/associations" element={<Association />} /> */}
                <Route path="/variants" element={<Variants />} />
            </Routes>
        </BrowserRouter >
    );

};

