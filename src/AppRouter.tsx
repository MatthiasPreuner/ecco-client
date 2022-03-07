import * as React from "react";
import { AppState, useSharedState } from "./states/AppState";
import { BrowserRouter as Router, Link, Routes, Route } from "react-router-dom";
import { Nav, Navbar, Container, NavDropdown, Modal, Button } from 'react-bootstrap';

import { Home } from "./components/Home";
import { Repositories } from "./components/Subpages/Repositories/Repositories";
import { Feature } from "./components/Subpages/Features/Feature";
import { Commits } from "./components/Subpages/Commits/Commits";
/* import { Artifact } from "./old/Artifact";
import { Association } from "./old/Association"; */
import { Variants } from "./components/Subpages/Variants/Variants";


export const AppRouter: React.FC = () => {

    const [appState, setAppState] = useSharedState();

    let logout = () => {
        setAppState((prevState: AppState) => ({
            ...prevState,
            userIsLoggedIn: false,
            directory: "",
        }));
    }

    let chooseRepo = (repo : string) => {
        setAppState((prevState: AppState) => ({
            ...prevState,
            directory: repo
        }));
    }

    return (
        <Router>
            <Navbar bg="light" expand="lg" fixed="top">
                <Container>
                    <Navbar.Brand href="/">EccoHub</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <Nav.Link as={Link} to="/">Home</Nav.Link>
                            <Nav.Link as={Link} to="features" disabled={!appState.eccoServiceIsInitialized}>Features</Nav.Link>
                            <Nav.Link as={Link} to="commits" disabled={!appState.eccoServiceIsInitialized}>Commits</Nav.Link>
                            <Nav.Link as={Link} to="variants" disabled={!appState.eccoServiceIsInitialized}>Variants</Nav.Link>
                           {/*  <Nav.Link as={Link} to="artifacts" disabled={!appState.eccoServiceIsInitialized}>Artifacts</Nav.Link>
                            <Nav.Link as={Link} to="associations" disabled={!appState.eccoServiceIsInitialized}>Associations</Nav.Link> */}
                        </Nav>
                        <Nav>
                            {appState.currentRepository != null && appState.userIsLoggedIn &&
                                <NavDropdown title={'Repository: ' + appState.currentRepository.name} id="basic-nav-dropdown">
                                    {appState.availableRepositories.filter(e => e != appState.currentRepository.name).map((element, i) => {
                                        return (
                                            <NavDropdown.Item key={i} as={Link} to="" onClick={() => chooseRepo(element)}>{element}</NavDropdown.Item>
                                        )
                                    })
                                    }
                                    <NavDropdown.Divider />
                                    <NavDropdown.Item as={Link} to="repositories">Repository Settings</NavDropdown.Item>
                                </NavDropdown>
                            }
                            {appState.userIsLoggedIn ?
                                <NavDropdown title={"User Name"} id="basic-nav-dropdown">
                                    <NavDropdown.Item as={Link} to="">Account TODO</NavDropdown.Item>
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
{/*                 <Route path="/artifacts" element={<Artifact />} />
                <Route path="/associations" element={<Association />} /> */}
                <Route path="/variants" element={<Variants />} />
            </Routes>
        </Router >
    );

};

