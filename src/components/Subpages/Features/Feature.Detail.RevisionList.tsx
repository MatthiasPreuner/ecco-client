import * as React from "react";
import {FeatureModel} from "../../../model/FeatureModel";
import {useEffect, useState} from "react";

import {FeatureRevisionModel as FeatureRevisionModel} from "../../../model/FeatureRevisionModel";
import {CommunicationService} from "../../../services/CommunicationService";
import {FeatureRevisionResponse} from "../../../model/FeatureRevisionResponse";
import {FeatureSpecificRevisionDetail} from "./Feature.Detail.RevisionDetail.NOTINUSE";

import {FeatureDetail} from "./Feature.Detail";

import { Container, Col, Row, InputGroup, FormControl, Button, Card, Accordion, Form, ListGroup } from 'react-bootstrap';

interface FeatureSpecificRevisionProps {
    currentFeature: FeatureModel
}

export const FeatureSpecificRevisionList: React.FC<FeatureSpecificRevisionProps> = ({currentFeature}) => {

    const [featureRevisions, setFeatureRevisions] = useState<FeatureRevisionModel[]>([]);
    const [currentFeatureRevision, setCurrentFeatureRevision] = useState<FeatureRevisionModel>(null);

    useEffect(() => {
        CommunicationService.getInstance().getFeatureversionsFromFeature(currentFeature).then((featureRevisionResponse: FeatureRevisionResponse) => {
            setFeatureRevisions(featureRevisionResponse.data);
        });
        setCurrentFeatureRevision(null);
    }, [currentFeature]);

    const featureRevisionsComponent = featureRevisions.map((featureRevision: FeatureRevisionModel) => {
        let setCurrentFeatureRevisionCallback = () => {
            setCurrentFeatureRevision(featureRevision);
        }

        let validHTMLID = "validid" + featureRevision.id;

        return (
            <Card key={validHTMLID}>
                <Card.Header id="headingThree">
                    <h2 className="mb-0">
                        <button onClick={setCurrentFeatureRevisionCallback} className="btn btn-link btn-block text-center collapsed" type="button"
                                data-toggle="collapse" data-target={"#" + validHTMLID}>
                            {featureRevision.id}
                        </button>
                    </h2>
                </Card.Header>
                <div id={validHTMLID} className="collapse" data-parent="#featureVersionAccordionList">
                    {currentFeatureRevision == null ? "" : <FeatureSpecificRevisionDetail currentFeature={currentFeature} currentFeatureRevision={currentFeatureRevision} />}
                </div>
            </Card>
        );
    });

    return (
        <Row>
            <Col>
                <h3>Aktuelle Featureversion zu {currentFeature.name}</h3>
                <div id={"featureVersionAccordionList"} className={"accordion"}>
                    {featureRevisionsComponent}
                </div>
            </Col>
        </Row>
    );
}
