import * as React from "react";
import { useEffect, useState } from "react";
import { Row, Col, Form } from 'react-bootstrap';

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
    onChange?: (enabledFeatures: string, disabledFeatures: string) => void,
}

// manualfeatures

export const FeatureSelector: React.FC<FeatureSelectorProps> = (props) => {

    const [features, setFeatures] = useState<FeatureSelectorFeature[]>(null);

    useEffect(() => {
        if (props.features) changeFeatures([...props.features]);
    }, [props.features]);

    const changeFeatures = (changedFeatures: FeatureSelectorFeature[]) => {
        let enabledFeatures = changedFeatures?.filter(ft => ft.enabled).map(ft => ft.name + '.' + ft.revision).join(', ');
        let disabledFeatures = changedFeatures?.filter(ft => !ft.enabled).map(ft => '-' + ft.name + '.' + ft.revision).join(', ');
        props.onChange.call(this, enabledFeatures, disabledFeatures);
        setFeatures(changedFeatures);
    }

    const changeAll = (to: boolean) => {
        var changedFeatures = [...features]
        changedFeatures.forEach(f => f.enabled = to)
        changeFeatures(changedFeatures);
    }

    return (
        <>
            <div key={0} className="d-flex flex-row-reverse"> {/* // </TODO> */}
                <button className="btn" onClick={()=>changeAll(false)}><i className="bi bi-dash-square" /></button>
                <button className="btn"  onClick={()=>changeAll(true)}><i className="bi bi-plus-square" /></button>
            </div>
            {features?.map((ft, i) => (
                <Row key={i + 1}>
                    <Col xs={10}>
                        <Form.Check id={i.toString()} className='my-1'>
                            <Form.Check.Input isInvalid={features.filter(f => f.enabled).length < 1} // counterintuitive
                                checked={ft.enabled}
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