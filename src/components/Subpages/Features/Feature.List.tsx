import * as React from "react";
import { AppState, useSharedState } from "../../../states/AppState";
import { useEffect, useState } from "react";
import { FeatureModel } from "../../../model/FeatureModel";

import { FeatureSpecificRevisionList } from "./Feature.Detail.RevisionList";
import { FeatureDetail } from "./Feature.Detail";

import { Container, Col, Row, InputGroup, FormControl, Button, Card, Accordion, Form, ListGroup } from 'react-bootstrap';


export const FeatureList: React.FC = () => {

    const [appState, setAppState] = useSharedState();
    const [featureFilterText, setFeatureFilterText] = useState<string>("");
    /*    const [tmpCurrentFeature, setTmpCurrentFeature] = useState<FeatureModel>(null); */
    const [tmpCurrentFeature, setTmpCurrentFeature] = useState<FeatureModel>(appState.features[0]);

    const getCurrentFeatureExpression = (): JSX.Element[] => {
        return appState.features.map((feature: FeatureModel, i) => {
            if (feature.name.includes(featureFilterText)) {
                return (
                    <ListGroup.Item action variant="light" active={feature == tmpCurrentFeature} onClick={() => setTmpCurrentFeature(feature)}>{feature.name}</ListGroup.Item>
                );
            }
        }).filter((singleJSXElement: JSX.Element) => {
            return singleJSXElement != undefined || singleJSXElement != null;
        });
    }
    let features = getCurrentFeatureExpression();
    return (
        <>
            <Row>
                <h3>Features</h3>
                <Col xs={6} className="mr-auto mb-3">
                    <InputGroup className="mb-3">
                        <InputGroup.Text><i className="bi bi-funnel-fill"></i></InputGroup.Text>
                        <FormControl
                            placeholder="Featurename for filtering..."
                            onChange={e => setFeatureFilterText(e.target.value)}
                            value={featureFilterText}
                        />
                        {featureFilterText.length > 0 ? <Button variant="outline-primary" onClick={() => setFeatureFilterText("")}><i className="bi bi-x"></i></Button> : null}
                    </InputGroup>
                </Col>
            </Row>
            <Row className="my-4">
                <Col xs={6}>
                    <ListGroup className="features-list-group">
                        {features.length > 0 ? features : <p>Please consider using a different featurename to filter all features! There are no results!</p>}
                    </ListGroup>
                </Col>
                <Col xs={6}>
                    {tmpCurrentFeature == null ? "" : <FeatureSpecificRevisionList currentFeature={tmpCurrentFeature} />}
                    <FeatureDetail currentSelectedFeatureModel={tmpCurrentFeature} />
                </Col>
            </Row>
        </>
    );

}
