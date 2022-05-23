import * as React from "react";
import { useEffect, useState } from "react";
import { Button, Modal, Row, Col, Form } from 'react-bootstrap';
import { useSharedState } from "../../states/AppState";

import { RepositoryResponse } from "../../model/RepositoryResponse";
import { SpinButtonGroup } from "./SpinButtonGroup";

export interface FeatureSelectorFeature {
    enabled: boolean,
    name: string,
    revision: number,
    availableRevisions: number[]
}

export interface FeatureSelectorProps {
    features?: FeatureSelectorFeature[],
    disableRevisions?: boolean,
    onChange?: (config: string) => void,
}

// manualfeatures

export const FeatureSelector: React.FC<FeatureSelectorProps> = (props) => {

    const [features, setFeatures] = useState<FeatureSelectorFeature[]>(null);

    useEffect(() => {
        console.log(props.features)
        if (props.features)
            setFeatures([...props.features]);
        console.log("props")
    }, [props.features]);

    const changeFeatures = (changedFeatures: FeatureSelectorFeature[]) => {
        let config = changedFeatures?.filter(ft => ft.enabled).map(ft => ft.name + '.' + ft.revision).join(', ');
        props.onChange.call(this, config);
        console.log(changedFeatures)
        setFeatures(changedFeatures);
    }

    return (
        <>
            {features?.map((ft, i) => (
                <Row key={i}>
                    <Col xs={10}>
                        <Form.Check id={i.toString()} className='my-1'>
                            <Form.Check.Input isInvalid={features.filter(f => f.enabled).length < 1} // counterintuitive
                                onChange={() => {
                                    var changedFeatures = [...features]
                                    changedFeatures[i].enabled = !ft.enabled;
                                    changedFeatures[i].revision = changedFeatures[i].enabled ? changedFeatures[i].revision : 1
                                    changeFeatures(changedFeatures);
                                }}
                            />
                            <Form.Check.Label>{ft.name}</Form.Check.Label>
                            {(i === features.length - 1) && <Form.Control.Feedback type="invalid">Select at least one feature!</Form.Control.Feedback>}
                        </Form.Check>
                    </Col>
                    <Col>
                        {!props.disableRevisions && ft.enabled &&
                            <SpinButtonGroup
                                value={ft.revision}
                                min={Math.min(...ft.availableRevisions)}
                                max={Math.max(...ft.availableRevisions)}
                                onChange={value => {
                                    var changedFeatures = [...features]
                                    let oldRevivision = ft.revision
                                    let oldIndex = ft.availableRevisions.indexOf(oldRevivision)
                                    changedFeatures[i].revision = ft.availableRevisions[oldIndex + value];
                                    changeFeatures(changedFeatures);
                                }}
                            />
                        }
                    </Col>
                </Row>
            ))
            }
        </>
    );
}