import * as React from "react";
import { FeatureModel } from "../../../model/FeatureModel";
import { useEffect, useState } from "react";

import { FeatureRevisionModel as FeatureRevisionModel } from "../../../model/FeatureRevisionModel";
import { CommunicationService } from "../../../services/CommunicationService";
import { FeatureRevisionResponse } from "../../../model/FeatureRevisionResponse";
import { FeatureRevisionDetail } from "./Feature.Detail.RevisionDetail";

import { FeatureDetail } from "./Feature.Detail";

import { Container, Col, Row, InputGroup, FormControl, Button, Card, Accordion, Form, ListGroup, ButtonGroup } from 'react-bootstrap';

interface FeatureRevisionProps {
    feature: FeatureModel
}

export const FeatureRevisionList: React.FC<FeatureRevisionProps> = ({ feature: feat }) => {

    const [currentFeatureRevision, setCurrentFeatureRevision] = useState<FeatureRevisionModel>(feat.revisions[feat.revisions.length - 1]);
    const [currentFeatureRevisionIndex, setCurrentFeatureRevisionIndex] = useState<number>(feat.revisions.length - 1);

    useEffect(() => {
        maxIndex();
    }, [feat]);

    let minIndex = () => {
        setCurrentFeatureRevision(feat.revisions[0]);
        setCurrentFeatureRevisionIndex(0);
    }

    let incrIndex = () => {
        setCurrentFeatureRevision(feat.revisions[currentFeatureRevisionIndex + 1]);
        setCurrentFeatureRevisionIndex(currentFeatureRevisionIndex + 1);
    }

    let decrIndex = () => {
        setCurrentFeatureRevision(feat.revisions[currentFeatureRevisionIndex - 1]);
        setCurrentFeatureRevisionIndex(currentFeatureRevisionIndex - 1);
    }

    let maxIndex = () => {
        setCurrentFeatureRevision(feat.revisions[feat.revisions.length - 1]);
        setCurrentFeatureRevisionIndex(feat.revisions.length - 1);
    }

    const btnVariant = 'primary';

    return (
        <Row>
            <Col>
                <h5>Featurerevisions:</h5>

                <ButtonGroup className="m-2 d-flex justify-content-between">
                    <Button variant={btnVariant}
                        disabled={currentFeatureRevisionIndex == 0}
                        onClick={minIndex}>&lt;&lt;</Button>
                    <Button variant={btnVariant}
                        disabled={currentFeatureRevisionIndex == 0}
                        onClick={decrIndex}>&lt;</Button>
                    <Button variant={btnVariant} style={{ width: '50px' }}>{currentFeatureRevision.id}</Button>
                    <Button variant={btnVariant}
                        disabled={currentFeatureRevisionIndex == feat.revisions.length - 1}
                        onClick={incrIndex}>&gt;</Button>
                    <Button variant={btnVariant}
                        disabled={currentFeatureRevisionIndex == feat.revisions.length - 1}
                        onClick={maxIndex}>&gt;&gt;</Button>
                </ButtonGroup>
                <FeatureRevisionDetail
                    feature={feat}
                    featureRevision={currentFeatureRevision}
                />
            </Col>
        </Row>
    );
}
