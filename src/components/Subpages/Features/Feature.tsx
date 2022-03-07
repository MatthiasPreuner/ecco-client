import * as React from "react";
import { useSharedState } from "../../../states/AppState";
import { useEffect, useState } from "react";

import { Container, Col, Row, InputGroup, FormControl, Button, Card, Accordion, Form, ListGroup } from 'react-bootstrap';

import { CommunicationService } from "../../../services/CommunicationService";
import { FeatureResponse } from "../../../model/FeatureResponse";

import { FeatureModel } from "../../../model/FeatureModel";
import { FeatureDetail } from "./Feature.Detail";


export const Feature: React.FC = () => {

    /*     useEffect(() => {
            CommunicationService.getInstance().getFeatures().then((apiData: FeatureResponse) => {
                setAppState((previousState) => ({
                    ...previousState,
                    features: apiData.data
                }));
            });
        }, []); */

    const [appState, setAppState] = useSharedState();
    const [featureFilterText, setFeatureFilterText] = useState<string>("");
    /*    const [tmpCurrentFeature, setTmpCurrentFeature] = useState<FeatureModel>(null); */
    const [tmpCurrentFeature, setTmpCurrentFeature] = useState<FeatureModel>(null);

    const getCurrentFeatureExpression = (): JSX.Element[] => {
        return appState.currentRepository.features.map((feature: FeatureModel, i) => {
            if (feature.name.toLowerCase().includes(featureFilterText.toLowerCase())) {
                return (
                    <ListGroup.Item key={i} action variant="light" active={feature == tmpCurrentFeature} onClick={() => setTmpCurrentFeature(feature)}>{feature.name}</ListGroup.Item>
                );
            }
        }).filter((singleJSXElement: JSX.Element) => {
            return singleJSXElement != undefined || singleJSXElement != null;
        });
    }
    let features = getCurrentFeatureExpression();

    return (
        <Container className="main d-flex pt-4 justify-content-center">
            <Col xs={6} className="px-3">
                <Row>
                    <h3>Features</h3>
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
                        <ListGroup className="features-list-group">
                            {features.length > 0 ? features : <p>Please consider using a different featurename to filter all features! There are no results!</p>}
                        </ListGroup>
                    </Col>
                </Row>
            </Col>
            <Col className="px-3">
                <FeatureDetail currentSelectedFeatureModel={tmpCurrentFeature} />
            </Col>

        </Container>
    )
}
