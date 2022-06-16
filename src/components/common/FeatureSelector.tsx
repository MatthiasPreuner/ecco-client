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

interface IProps {
    features?: FeatureSelectorFeature[],
    manualFeatures?: FeatureSelectorFeature[],
    disableRevisions?: boolean,
    onChange?: (enabledFeatures: string, disabledFeatures: string) => void,
    maxHeight?: string,
}

export const FeatureSelector: React.FC<IProps> = (props) => {

    const [configFeatures, setConfigFeatures] = useState<FeatureSelectorFeature[]>();
    const [manualFeatures, setManualFeatures] = useState<FeatureSelectorFeature[]>([]);

    const defaultFormState = {
        formValues: {
            features: ""
        },
        formErrors: {
            features: "Select at least one feature."
        },
        formValidity: {
            features: false
        }
    };

    const [formState, setFormState] = useState(defaultFormState);

    useEffect(() => {
        if (props.features) setConfigFeatures([...props.features]);
    }, [props.features]);

    useEffect(() => {
        if (props.manualFeatures) setManualFeatures([...props.manualFeatures]);
    }, [props.manualFeatures]);

    // updateConfigString
    useEffect(() => {
        if (props.onChange) {
            let enabledFeatures = configFeatures?.filter(ft => ft.enabled).concat(manualFeatures.filter(ft => ft.name !== "")).map(ft => (ft.enabled ? '' : '-') + ft.name + '.' + ft.revision).join(', ');
            let disabledFeatures = configFeatures?.filter(ft => !ft.enabled).map(ft => ft.name + '.' + ft.revision).join(', ');
            props.onChange.call(this, enabledFeatures, disabledFeatures);
        }
    }, [configFeatures, manualFeatures]); // adding props.onChange causes max depth violation

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

    const hasFeatures = configFeatures?.length > 0 || manualFeatures?.length > 0

    const isFeatureNameDuplicate = (name: string): boolean => {
        return (configFeatures.concat(manualFeatures).filter(f => f.name === name).length > 1)
    }

    const countSelectedFeatures = (): number => {
        return configFeatures.filter(f => f.enabled).length + (manualFeatures || []).filter(f => f.name).length
    }

    const handleValidation = () => { //(target: EventTarget & HTMLInputElement) => {

        let name = "features"
        /*  const { name, value } = target; */

        const fieldValidationErrors = formState.formErrors;
        const validity = formState.formValidity;
        const isFeatures = name === "features";

        let allFeatures: FeatureSelectorFeature[] = configFeatures.concat(manualFeatures)

        if (isFeatures) {

            fieldValidationErrors[name as keyof typeof fieldValidationErrors] = ``
            validity[name as keyof typeof validity] = false;

            if (!configFeatures) {
                fieldValidationErrors[name as keyof typeof fieldValidationErrors] = "Please select a repository."
            } else if (allFeatures.length !== new Set(allFeatures.map(f => f.name)).size) {
                fieldValidationErrors[name as keyof typeof fieldValidationErrors] = "Feature names must be unique."
            } else if (countSelectedFeatures() === 0) {
                fieldValidationErrors[name as keyof typeof fieldValidationErrors] = "Select at least one feature."
            } else {
                validity[name as keyof typeof validity] = true;
            }
            var validationTag = document.getElementById("featureSelector") as HTMLSelectElement;
            if(validationTag)
                validationTag.setCustomValidity(fieldValidationErrors[name as keyof typeof fieldValidationErrors]);
        }

        setFormState({
            ...formState,
            formErrors: fieldValidationErrors,
            formValidity: validity
        });
    };

    useEffect(() => {
        if (configFeatures)
            handleValidation();
    }, [configFeatures, manualFeatures]);

    // render
    if (configFeatures === undefined) {

        return (<Row><i>Please Select a repository.</i></Row>)

    } else {

        const heightStyle = (props.maxHeight ? { height: props.maxHeight } : {})
        return (
            <>
                <select hidden id="featureSelector"></select>
                <Row style={{ position: 'sticky', top: '0', backgroundColor: '#fff', zIndex: 5 }} className="mb-1">
                    {hasFeatures ?
                        <>
                            <Col xs={9}>
                                <Form.Group>
                                    <Form.Control
                                        className={`${formState.formErrors.features ? "is-invalid" : "is-valid"}`}
                                        type="hidden" />
                                    <Form.Control.Feedback type="valid">{countSelectedFeatures() + " features selected."}</Form.Control.Feedback>
                                    <Form.Control.Feedback type="invalid">{formState.formErrors.features}</Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            <Col className="rct-options rct-options-custom">
                                <button key={"b0"} onClick={() => switchAll(true)} aria-label="Select all" title="Select all" type="button" className="rct-option rct-option-expand-all"><i className="bi bi-plus-square" /></button>
                                <button key={"b1"} onClick={() => switchAll(false)} aria-label="Deselect all" title="Deselect all" type="button" className="rct-option rct-option-collapse-all"><i className="bi bi-dash-square" /></button>
                            </Col>
                        </> :
                        <i>Repository has no features.</i>
                    }
                </Row>
                <Row style={heightStyle} className="scroll-area">
                    <Col >
                        {configFeatures?.map((ft, i) => (
                            <Row key={i} className="mt-1">
                                <Col xs={10}>
                                    <Form.Check id={i.toString()} className='my-1'>
                                        <Form.Check.Input
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
                            <Row key={configFeatures?.length + i} className="mt-1">
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
                                        <input placeholder="Feature Name"
                                            type="text"
                                            className={"form-control form-control-sm input-new" + (isFeatureNameDuplicate(ft.name) ? " is-invalid" : "")}
                                            style={{ marginLeft: '-25px' }}
                                            value={ft.name}
                                            onChange={event => {
                                                var tmpManualFeatures = [...manualFeatures]
                                                // if it was empty before
                                                if (tmpManualFeatures[i].name === '') {
                                                    tmpManualFeatures.push({ enabled: false, name: '', revision: 1, availableRevisions: [1] }) // add new empty
                                                    tmpManualFeatures[i].enabled = true; // enable self
                                                }
                                                tmpManualFeatures[i].name = event.target.value;
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
                    </Col>
                </Row>
            </>

        )
    }
}