import * as React from "react";
import { useEffect, useState } from "react";
import { Row, Col, Form, InputGroup, Button } from 'react-bootstrap';

import { SpinButtonGroup } from "./SpinButtonGroup";


import './FeatureSelector.scss';

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

export const FeatureSelector: React.FC<FeatureSelectorProps> = (props) => {

    const [configFeatures, setConfigFeatures] = useState<FeatureSelectorFeature[]>();
    const [manualFeatures, setManualFeatures] = useState<FeatureSelectorFeature[]>([]);

    useEffect(() => {
        if (props.features) setConfigFeatures([...props.features]);
    }, [props.features]);

    useEffect(() => {
        if (props.manualFeatures) setManualFeatures([...props.manualFeatures]);
    }, [props.manualFeatures]);

    // updateConfigString
    useEffect(() => {
        let enabledFeatures = configFeatures?.filter(ft => ft.enabled).concat(manualFeatures.filter(ft => ft.name !== "")).map(ft => (ft.enabled ? '' : '-') + ft.name + '.' + ft.revision).join(', ');
        let disabledFeatures = configFeatures?.filter(ft => !ft.enabled).map(ft => ft.name + '.' + ft.revision).join(', ');
        props.onChange.call(this, enabledFeatures, disabledFeatures);
    }, [configFeatures, manualFeatures]);

    const switchAll = (to: boolean) => {
        var tmpConfigFeatures = [...configFeatures]
        tmpConfigFeatures.forEach(f => f.enabled = to)

        var tmpManualFeatures = [...manualFeatures]
        tmpManualFeatures.forEach(f => {
            if (f.name !== "") f.enabled = to;
        });

        setConfigFeatures(tmpConfigFeatures);
        setManualFeatures(tmpManualFeatures);
    }

    let removeManualFeature = (i: number) => {
        var tmpManualFeatures = [...manualFeatures]
        tmpManualFeatures.splice(i, 1) // remove inplace
        setManualFeatures(tmpManualFeatures);
    }

    if (configFeatures === undefined) return (
        <Row><i>Please Select a repository.</i></Row>
    )

    const hasFeatures = configFeatures?.length > 0 || manualFeatures?.length > 0
    const inValid = configFeatures && configFeatures.length > 0 && configFeatures.concat(manualFeatures).filter(f => f.enabled).length < 1;
    const valid = configFeatures && configFeatures.length > 0 && configFeatures.concat(manualFeatures || []).filter(f => f.enabled).length > 0;

    return (
        <>
            <Row key={0} style={{ position: 'sticky', top: '0', backgroundColor: '#fff', zIndex: 5 }}>
                {hasFeatures ?
                    <>
                        <Col xs={9}>
                            <Form.Group>
                                <Form.Control isInvalid={inValid} isValid={valid} type="hidden" />
                                <Form.Control.Feedback type="valid">Looks good!</Form.Control.Feedback>
                                <Form.Control.Feedback type="invalid">Select at least one feature!</Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                        <Col className="rct-options">
                            <button key={"b0"} onClick={() => switchAll(true)} aria-label="Select all" title="Select all" type="button" className="rct-option rct-option-expand-all"><i className="bi bi-plus-square" /></button>
                            <button key={"b1"} onClick={() => switchAll(false)} aria-label="Deselect all" title="Deselect all" type="button" className="rct-option rct-option-collapse-all"><i className="bi bi-dash-square" /></button>
                        </Col>
                    </> :
                    <i>Repository has no features.</i>
                }
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
                                    setConfigFeatures(changedFeatures);
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
                                    setConfigFeatures(changedFeatures);
                                }}
                            />
                        }
                    </Col>
                </Row>
            ))}
            {manualFeatures?.map((ft, i) => (
                <Row key={configFeatures?.length + i}>
                    <Col xs={1}>
                        <input type="checkbox" id="new" className="form-check-input my-1"
                            disabled={ft.name === ''}
                            checked={ft.enabled}
                            onChange={event => {
                                var tmpManualFeatures = [...manualFeatures]
                                tmpManualFeatures[i].enabled = !ft.enabled;
                                setManualFeatures(tmpManualFeatures);
                            }} />
                    </Col>
                    <Col xs={9}>
                        <InputGroup>
                            <input placeholder="Feature Name" type="text" className="form-control form-control-sm input-new" style={{ marginLeft: '-25px' }}
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
                                    setManualFeatures(tmpManualFeatures);
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