import * as React from "react";
import { FeatureModel } from "../../../model/FeatureModel";
import { useEffect, useState } from "react";

import { FeatureRevisionModel as FeatureRevisionModel } from "../../../model/FeatureRevisionModel";
import { FeatureRevisionDetail } from "./Feature.Detail.RevisionDetail";

import { Col, Row, Dropdown } from 'react-bootstrap';

interface FeatureRevisionProps {
    feature: FeatureModel
}

export const FeatureRevisionList: React.FC<FeatureRevisionProps> = ({ feature: feat }) => {

    const [currentFeatureRevision, setCurrentFeatureRevision] = useState<FeatureRevisionModel>(feat.revisions[feat.revisions.length - 1]);
    const [currentFeatureRevisionIndex, setCurrentFeatureRevisionIndex] = useState<number>(feat.revisions.length - 1);

    useEffect(() => {
        feat?.revisions.sort((a, b) => Number(a.id) - Number(b.id));
        if (feat?.name !== currentFeatureRevision?.featureRevisionString.split('.')[0]) {
            maxIndex();
        } else {
            setIndex(currentFeatureRevisionIndex);
        }

    }, [feat]);

    let maxIndex = () => {
        setCurrentFeatureRevision(feat.revisions[feat.revisions.length - 1]);
        setCurrentFeatureRevisionIndex(feat.revisions.length - 1);
    }

    let setIndex = (index: number) => {
        setCurrentFeatureRevision(feat.revisions[index]);
        setCurrentFeatureRevisionIndex(index);
    }

    const btnVariant = 'primary';

    return (
        <Row>
            <Col>
                <Row className="d-flex justify-content-between">
                    <Col xs={6}><h5>Featurerevisions:</h5></Col>
                    <Col xs={6} className="d-flex justify-content-end">
                        <Dropdown className="d-flex justify-content-end">
                            <Dropdown.Toggle variant="primary" id="dropdown-basic">{currentFeatureRevision.id}</Dropdown.Toggle>
                            <Dropdown.Menu>
                                {feat.revisions.map((r, i) =>
                                    <Dropdown.Item key={i}
                                        onClick={() => setIndex(i)}
                                    >{r.id}</Dropdown.Item>
                                )}
                            </Dropdown.Menu>
                        </Dropdown>
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
