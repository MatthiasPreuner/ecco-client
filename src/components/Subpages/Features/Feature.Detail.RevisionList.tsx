import * as React from "react";
import { FeatureModel } from "../../../model/FeatureModel";
import { useEffect, useState } from "react";

import { FeatureRevisionModel } from "../../../model/FeatureRevisionModel";
import { FeatureRevisionDetail } from "./Feature.Detail.RevisionDetail";

import { Col, Row } from 'react-bootstrap';
import { SpinButtonGroup } from "../../common/SpinButtonGroup";

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
        if (feat?.name !== currentFeatureRevision?.featureName) {
            maxIndex();
        } else {
            setIndex(currentFeatureRevisionIndex);
        }

    });

    return (
        <>
            <div className="m-2 d-flex justify-content-between">
                <Col xs={10}>
                    <h5>Featurerevisions:</h5>
                </Col>
                <SpinButtonGroup
                    value={parseInt(currentFeatureRevision.id)}
                    min={Math.min(...feat.revisions.map(r => parseInt(r.id)))}
                    max={Math.max(...feat.revisions.map(r => parseInt(r.id)))}
                    onChange={value => setIndex(currentFeatureRevisionIndex + value)}
                />
            </div>
            <FeatureRevisionDetail
                feature={feat}
                featureRevision={currentFeatureRevision}
            />
        </>
    );
}
