import * as React from "react";
import { useEffect, useState } from "react";
import { Row, Col, Form, InputGroup, Button } from 'react-bootstrap';

import { SpinButtonGroup } from "./SpinButtonGroup";


export interface FeatureSelectorFeature {
    enabled: boolean,
    name: string,
    revision: number,
    availableRevisions: number[]
}

export interface FeatureSelectorProps {
    features?: FeatureSelectorFeature[],
    manualFeatures?: FeatureSelectorFeature[],
    disableRevisions?: boolean,
    onChange?: (enabledFeatures: string, disabledFeatures: string) => void,
}

// manualfeatures

export const FeatureSelector: React.FC<FeatureSelectorProps> = (props) => {

    const [configFeatures, setConfigFeatures] = useState<FeatureSelectorFeature[]>([]);
    const [manualFeatures, setManualFeatures] = useState<FeatureSelectorFeature[]>([]);

    useEffect(() => {
        if (props.features) changeConfigFeatures([...props.features]);
    }, [props.features]);

    useEffect(() => {
        if (props.manualFeatures) changeManualFeatures([...props.manualFeatures]);
    }, [props.manualFeatures]);

    // updateConfigString
    useEffect(() => {
        let enabledFeatures = configFeatures?.filter(ft => ft.enabled).concat(manualFeatures.filter(ft => ft.name !== "")).map(ft => (ft.enabled ? '' : '-') + ft.name + '.' + ft.revision).join(', ');
        // TODO
        let disabledFeatures = configFeatures?.filter(ft => !ft.enabled).map(ft => '-' + ft.name + '.' + ft.revision).join(', ');
        props.onChange.call(this, enabledFeatures, disabledFeatures);
    }, [configFeatures, manualFeatures]);

    const changeConfigFeatures = (changedFeatures: FeatureSelectorFeature[]) => {
        setConfigFeatures(changedFeatures);
    }

    const changeManualFeatures = (changedFeatures: FeatureSelectorFeature[]) => {
        setManualFeatures(changedFeatures);
    }

    const changeFeatures = (configFeatures: FeatureSelectorFeature[], manualFeatures: FeatureSelectorFeature[]) => {
        setConfigFeatures(configFeatures);
        setManualFeatures(manualFeatures);
    }


    const switchAll = (to: boolean) => {
        var tmpConfigFeatures = [...configFeatures]
        tmpConfigFeatures.forEach(f => f.enabled = to)

        var tmpManualFeatures = [...manualFeatures]
        tmpManualFeatures.forEach(f => {
            if (f.name !== "") f.enabled = to;
        });

        changeFeatures(tmpConfigFeatures, tmpManualFeatures);
    }

    let removeManualFeature = (i: number) => {
        var tmpManualFeatures = [...manualFeatures]
        tmpManualFeatures.splice(i, 1) // remove inplace
        setManualFeatures(tmpManualFeatures);
    }

    const inValid = configFeatures !== null && configFeatures.length > 0 && configFeatures.filter(f => f.enabled).length < 1;
    const valid = configFeatures !== null && configFeatures.length > 0 && configFeatures.filter(f => f.enabled).length > 0;

    return (
        <>
            <Row key={0}>
                <Col xs={9}>
                    <Form.Group>
                        <Form.Control isInvalid={inValid} isValid={valid} type="hidden" />
                        <Form.Control.Feedback type="valid">Looks good!</Form.Control.Feedback>
                        <Form.Control.Feedback type="invalid">Select at least one feature!</Form.Control.Feedback>
                    </Form.Group>
                </Col>
                <Col className="d-flex flex-row-reverse">
                    <button className="btn" type="button" onClick={() => switchAll(false)}><i className="bi bi-dash-square" /></button>
                    <button className="btn" type="button" onClick={() => switchAll(true)}><i className="bi bi-plus-square" /></button>
                </Col>
            </Row>
            {configFeatures?.map((ft, i) => (
                <Row key={i + 1}>
                    <Col xs={10}>
                        <Form.Check id={i.toString()} className='my-1'>
                            <Form.Check.Input /*  isInvalid={inValid} */
                                checked={ft.enabled}
                                onChange={() => {
                                    var changedFeatures = [...configFeatures]
                                    changedFeatures[i].enabled = !ft.enabled;
                                    changedFeatures[i].revision = changedFeatures[i].enabled ? changedFeatures[i].revision : 1
                                    changeConfigFeatures(changedFeatures);
                                }}
                            />
                            <Form.Check.Label>{ft.name}</Form.Check.Label>
                        </Form.Check>
                    </Col>
                    <Col className="px-1">
                        {!props.disableRevisions && ft.enabled &&
                            <SpinButtonGroup
                                value={ft.revision}
                                min={Math.min(...ft.availableRevisions)}
                                max={Math.max(...ft.availableRevisions)}
                                onChange={value => {
                                    var changedFeatures = [...configFeatures]
                                    let oldRevivision = ft.revision
                                    let oldIndex = ft.availableRevisions.indexOf(oldRevivision)
                                    changedFeatures[i].revision = ft.availableRevisions[oldIndex + value];
                                    changeConfigFeatures(changedFeatures);
                                }}
                            />
                        }
                    </Col>
                </Row>
            ))}
            {manualFeatures?.map((ft, i) => (
                <Row>
                    <Col xs={1}>
                        <input type="checkbox" id="new" className="form-check-input my-1"
                            disabled={ft.name === ''}
                            checked={ft.enabled}
                            onChange={event => {
                                var tmpManualFeatures = [...manualFeatures]
                                tmpManualFeatures[i].enabled = !ft.enabled;
                                changeManualFeatures(tmpManualFeatures);
                            }}
                        /></Col>
                    <Col xs={9}>
                        <InputGroup>
                            <input placeholder="Feature Name" type="text" className="form-control no-validation form-control-sm input-new" style={{ marginLeft: '-25px' }}
                                value={ft.name}
                                onChange={event => {
                                    var tmpManualFeatures = [...manualFeatures]
                                    // if it was empty before
                                    if (tmpManualFeatures[i].name === '') {
                                        tmpManualFeatures.push({ enabled: false, name: '', revision: 1, availableRevisions: [1] }) // add new empty
                                        tmpManualFeatures[i].enabled = true; // enable self
                                        console.log(tmpManualFeatures);
                                    }
                                    tmpManualFeatures[i].name = event.target.value.toLocaleUpperCase();
                                    // if it is empty now
                                    if (event.target.value === '') {
                                        tmpManualFeatures = tmpManualFeatures.filter(feature => feature.name !== '') // remove all empty
                                        tmpManualFeatures = [...tmpManualFeatures, { enabled: false, name: '', revision: 1, availableRevisions: [1] }] // add new empty
                                    }
                                    changeManualFeatures(tmpManualFeatures);
                                }} />
                            {ft.name.length > 0 ? <Button size='sm' variant="outline-primary" onClick={() => removeManualFeature(i)}><i className="bi bi-x"></i></Button> : null}
                        </InputGroup>
                    </Col>
                    <Col xs={2} className="px-1">
                        <SpinButtonGroup
                            value={ft.revision} // new features start with revision 1
                            disabled
                        />
                    </Col>
                </Row>))}
        </>
    );
}