import * as React from "react";
import { useDropzone, FileWithPath } from 'react-dropzone'
import { useCallback, useState, useEffect } from "react";
import { CommunicationService } from "../../../services/CommunicationService";
import { AppState, useSharedState } from "../../../states/AppState";

import { Col, Row, Form, Button, InputGroup } from 'react-bootstrap';
import { RepositoryResponse } from "../../../model/RepositoryResponse";
import { CommitFeature } from "./Commits.MakeCommitModal"

interface FeatureRowProps {
    configFile: FileWithPath,
    setConfigString: React.Dispatch<React.SetStateAction<string>>
}

export const FeatureRow: React.FC<FeatureRowProps> = (props: FeatureRowProps) => {

    const [appState, setAppState] = useSharedState();

    const initialManualFeatures = [{
        enabled: false,
        name: '',
        revision: 1,
    } as CommitFeature]

    const [manualFeatures, setManualFeatures] = useState<CommitFeature[]>(initialManualFeatures);

    const initialConfigFeatures = appState.repository.features.map(f => {
        return {
            enabled: false,
            name: f.name,
            revision: 1
        } as CommitFeature;
    })

    const [configFeatures, setConfigFeatures] = useState<CommitFeature[]>(initialConfigFeatures);

    const reader = new FileReader();

    reader.onload = function (progressEvent) {

        var featuresFromConfig: CommitFeature[] = [];
        var configText: string = progressEvent.target.result.toString();

        featuresFromConfig = configText.split(',').map(str => {

            str = str.replace(' ', '');
            var nameversion = str.replace('-', '').split('.');

            var feature: CommitFeature = {
                enabled: !str.startsWith('-'),
                name: nameversion[0].toUpperCase(),
                revision: parseInt(nameversion[1]),
            }
            return feature;
        })

        let newManualFeatures = [...initialManualFeatures]
        let newConfigFeatures = [...initialConfigFeatures]

        featuresFromConfig.forEach(f => {
            let index = configFeatures.findIndex(cf => cf.name === f.name);
            if (index >= 0) {
                let index = configFeatures.findIndex(cf => cf.name === f.name)
                newConfigFeatures[index].enabled = f.enabled;
                newConfigFeatures[index].revision = f.revision;
            } else {
                newManualFeatures.unshift(f); // add manual feature

            }
        })

        setConfigFeatures(newConfigFeatures);
        setManualFeatures(newManualFeatures);
    };

    useEffect(() => {
        if (props.configFile)
            reader.readAsText(props.configFile);
    }, [props.configFile]);

    let removeManualFeature = (i: number) => {
        var tmpManualFeatures = [...manualFeatures]
        tmpManualFeatures.splice(i, 1) // remove inplace
        setManualFeatures(tmpManualFeatures);
    }

    let config = configFeatures.filter(ft => ft.enabled).concat(manualFeatures.filter(ft => ft.name !== '')).map(ft => (ft.enabled ? '' : '-') + ft.name + '.' + ft.revision).join(', ')

    return (
        <Row style={{ height: '40vh', overflowY: 'scroll', marginRight: '0px' }}>
            <Col>
                {configFeatures.map((ft, i) => (
                    <>
                        <Row>
                            <Col xs={10}>
                                <Form.Check
                                    className='my-1'
                                    id={i.toString()}
                                    label={ft.name}
                                    checked={ft.enabled}
                                    isInvalid={config.length === 0}
                                    isValid={config.length > 0}
                                    formNoValidate // not working
                                    onChange={event => {
                                        var newConfigFeatures = [...configFeatures]
                                        newConfigFeatures[i].enabled = !ft.enabled;
                                        setConfigFeatures(newConfigFeatures);
                                    }}
                                />
                            </Col>
                            <Col xs={2} className="pe-1">
                                {ft.enabled &&
                                    <input
                                        type='number'
                                        className='form-control no-validation form-control form-control-sm'
                                        min={1}
                                        max={999} // TODO current + 1 or skipping enabled?
                                        /*    isInvalid={config.length === 0}
                                           isValid={config.length > 0}  */
                                        value={ft.revision}
                                        disabled={!ft.enabled}
                                        onChange={event => {
                                            var newConfigFeatures = [...configFeatures]
                                            newConfigFeatures[i].revision = parseInt(event.target.value);
                                            setConfigFeatures(newConfigFeatures);
                                        }}
                                    />}
                            </Col>
                        </Row>
                    </>
                ))}
                {manualFeatures.map((ft, i) => (
                    <Row>
                        <Col xs={1}>
                            <input type="checkbox" id="new" className="form-check-input my-1"
                                disabled={ft.name === ''}
                                checked={ft.enabled}
                                onChange={event => {
                                    var tmpManualFeatures = [...manualFeatures]
                                    tmpManualFeatures[i].enabled = !ft.enabled;
                                    setManualFeatures(tmpManualFeatures);
                                }}
                            /></Col>
                        <Col xs={9}>
                            <InputGroup>
                                <input placeholder="Feature Name" type="text" className="form-control no-validation form-control-sm" style={{ marginLeft: '-25px' }}
                                    value={ft.name}
                                    onChange={event => {
                                        var tmpManualFeatures = [...manualFeatures]
                                        // if it was empty before
                                        if (tmpManualFeatures[i].name === '') {
                                            tmpManualFeatures.push({ enabled: false, name: '', revision: 1 }) // add new empty
                                            tmpManualFeatures[i].enabled = true; // enable self
                                        }
                                        tmpManualFeatures[i].name = event.target.value.toLocaleUpperCase();
                                        // if it is empty now
                                        if (event.target.value === '') {
                                            tmpManualFeatures = tmpManualFeatures.filter(feature => feature.name !== '') // remove all empty
                                            tmpManualFeatures = [...tmpManualFeatures, { enabled: false, name: '', revision: 1 }] // add new empty
                                        }
                                        setManualFeatures(tmpManualFeatures);
                                    }} />
                                {ft.name.length > 0 ? <Button size='sm' variant="outline-primary" onClick={() => removeManualFeature(i)}><i className="bi bi-x"></i></Button> : null}
                            </InputGroup>
                        </Col>
                        <Col xs={2} className="pe-1">
                            <input
                                type='number'
                                className='form-control form-control-sm'
                                value={ft.revision} // new features start with revision 1
                                disabled
                            />
                        </Col>
                    </Row>))}
            </Col>
        </Row>
    )
};