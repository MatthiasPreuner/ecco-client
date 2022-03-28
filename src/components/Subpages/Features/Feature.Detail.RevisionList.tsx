import * as React from "react";
import { FeatureModel } from "../../../model/FeatureModel";
import { useEffect, useState } from "react";

import { FeatureRevisionModel as FeatureRevisionModel } from "../../../model/FeatureRevisionModel";
import { FeatureRevisionDetail } from "./Feature.Detail.RevisionDetail";

import { Col, Row, Button, ButtonGroup } from 'react-bootstrap';

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

    let setIndex = (index: number) => {
        setCurrentFeatureRevision(feat.revisions[index]);
        setCurrentFeatureRevisionIndex(index);
    }

    const btnVariant = 'primary';

    return (
        <Row>
            <Col>
                <h5>Featurerevisions:</h5>
                <ButtonGroup className="d-flex justify-content-between">
                    <ButtonGroup className="m-2 d-flex justify-content-between">
                        <Button variant={btnVariant}
                            disabled={currentFeatureRevisionIndex === 0}
                            onClick={minIndex}>&lt;&lt;</Button>
                        <Button variant={btnVariant}
                            disabled={currentFeatureRevisionIndex === 0}
                            onClick={decrIndex}>&lt;</Button>
                    </ButtonGroup>

                    <ButtonGroup className="m-2">
                        {[-2, -1, 0, 1, 2].map(i => {


                            //let x = i;
                            return (<Button key={i + 20} variant={btnVariant} style={{ width: '50px' }}>{currentFeatureRevision.id}</Button>)
                        })
                        }
                    </ButtonGroup>
                    <ButtonGroup className="m-2 d-flex justify-content-between">
                        <Button variant={btnVariant}
                            disabled={currentFeatureRevisionIndex === feat.revisions.length - 1}
                            onClick={incrIndex}>&gt;</Button>
                        <Button variant={btnVariant}
                            disabled={currentFeatureRevisionIndex === feat.revisions.length - 1}
                            onClick={maxIndex}>&gt;&gt;</Button>
                    </ButtonGroup>
                </ButtonGroup>
                <FeatureRevisionDetail
                    feature={feat}
                    featureRevision={currentFeatureRevision}
                />
            </Col>
        </Row >
    );
}
