import * as React from "react";
import { useSharedState } from "../../../states/AppState";
import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';

import { Container, Col, Row, InputGroup, FormControl, Button, ListGroup } from 'react-bootstrap';

import { FeatureModel } from "../../../model/FeatureModel";
import { FeatureDetail } from "./Feature.Detail";

export const Feature: React.FC = () => {

    const [appState, setAppState] = useSharedState();
    const [featureFilterText, setFeatureFilterText] = useState<string>("");
    const [tmpCurrentFeature, setTmpCurrentFeature] = useState<FeatureModel>(null);

    const navigate = useNavigate();

    const getCurrentFeatureExpression = (): JSX.Element[] => {
        return appState.repository?.features.map((feature: FeatureModel, i) => {
            if (feature.name.toLowerCase().includes(featureFilterText.toLowerCase())) {
                return (
                    <ListGroup.Item key={i} action active={feature === tmpCurrentFeature} onClick={() => setTmpCurrentFeature(feature)}>{feature.name}</ListGroup.Item>
                );
            }
        }).filter((singleJSXElement: JSX.Element) => {
            return singleJSXElement !== undefined || singleJSXElement != null;
        });
    }
    let features = getCurrentFeatureExpression();

    useEffect(() => {
        if (!appState.userIsLoggedIn || appState.repository === null) {
            navigate(`/`)
        } else {
            setTmpCurrentFeature(appState.repository.features.find(f => f.id === tmpCurrentFeature?.id)) // update, when new repository is received after changing smtg
        }
    }, [appState.repository]);

    return (
        <Container className="main d-flex pt-4 justify-content-center">
            <Col>
                <Row><h3>Features</h3></Row>
                {appState.repository == null ?
                    <Row><p>No Repository selected.</p></Row> :
                    <Row>
                        <Col xs={6} className="pr-3">
                            <Row>
                                <InputGroup className="mb-3">
                                    <InputGroup.Text><i className="bi bi-funnel-fill"></i></InputGroup.Text>
                                    <FormControl
                                        placeholder="Featurename for filtering..."
                                        onChange={e => setFeatureFilterText(e.target.value)}
                                        value={featureFilterText}
                                    />
                                    {featureFilterText.length > 0 ? <Button variant="outline-primary" onClick={() => setFeatureFilterText("")}><i className="bi bi-x"></i></Button> : null}
                                </InputGroup>
                            </Row>
                            <Row className="my-4">
                                <Col>
                                    <ListGroup style={{ maxHeight: 'calc(100vh - 250px)' }}>
                                        {appState.repository.features.length == 0 ?
                                            <p>This Repository has no Features yet. Features are added with new Commits.</p> :
                                            features.length == 0 ?
                                                <p>Please consider using a different filter condition. There are no results.</p> :
                                                features}
                                    </ListGroup>
                                </Col>
                            </Row>
                        </Col>
                        <Col className="px-3">
                            <FeatureDetail currentSelectedFeatureModel={tmpCurrentFeature} />
                        </Col>
                    </Row>
                }
            </Col>
        </Container>
    )
}
