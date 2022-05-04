import * as React from "react";
import { FeatureModel } from "../../../model/FeatureModel";
import { useEffect, useState } from "react";

import { FeatureRevisionModel } from "../../../model/FeatureRevisionModel";
import { FeatureRevisionDetail } from "./Feature.Detail.RevisionDetail";

import { Col, Row } from 'react-bootstrap';
import { SpinButtonGroup } from "../../SpinButtonGroup";

interface FeatureRevisionProps {
    feature: FeatureModel
}

export const FeatureRevisionList: React.FC<FeatureRevisionProps> = ({ feature: feat }) => {

    const [currentFeatureRevision, setCurrentFeatureRevision] = useState<FeatureRevisionModel>(feat.revisions[feat.revisions.length - 1]);
    const [currentFeatureRevisionIndex, setCurrentFeatureRevisionIndex] = useState<number>(feat.revisions.length - 1);

    const maxIndex = () => {
        setCurrentFeatureRevision(feat.revisions[feat.revisions.length - 1]);
        setCurrentFeatureRevisionIndex(feat.revisions.length - 1);
    }

    const setIndex = (index: number) => {
        setCurrentFeatureRevision(feat.revisions[index]);
        setCurrentFeatureRevisionIndex(index);
    }

    useEffect(() => {
        feat?.revisions.sort((a, b) => Number(a.id) - Number(b.id));
        if (feat?.name !== currentFeatureRevision?.featureRevisionString.split('.')[0]) {
            maxIndex();
        } else {
            setIndex(currentFeatureRevisionIndex);
        }

    });

    return (
        <Row>
            <Col>
                <Row className="d-flex justify-content-between">
                    <Col xs={9}><h5>Featurerevisions:</h5></Col>
                    <Col xs={3} className="d-flex justify-content-end">
                        <SpinButtonGroup
                            value={parseInt(currentFeatureRevision.id)}
                            min={Math.min(...feat.revisions.map(r => parseInt(r.id)))}
                            max={Math.max(...feat.revisions.map(r => parseInt(r.id)))}
                            onChange={value => setIndex(currentFeatureRevisionIndex + value)}
                            />
                    </Col>
                </Row>
                <FeatureRevisionDetail
                    feature={feat}
                    featureRevision={currentFeatureRevision}
                />
            </Col>
        </Row >
    );
}
