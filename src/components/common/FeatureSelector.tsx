import * as React from "react";
import { useState } from "react";
import { Button, Modal, Row, Col, Form } from 'react-bootstrap';
import { useSharedState } from "../../states/AppState";

import { RepositoryResponse } from "../../model/RepositoryResponse";
import { SpinButtonGroup } from "./SpinButtonGroup";

interface VariantFeature {
    enabled: boolean,
    name: string,
    revision: number,
    availableRevisions: number[]
}

// params features, manualfeatures, onChange set string

export const FeatureSelector: React.FC = () => {

    const [appState, setAppState] = useSharedState();
    const [validated, setValidated] = useState(false);

    const initFeatures = () => appState.repository.features.map(ft => {
        let avail = ft.revisions.sort((a, b) => Number(a.id) - Number(b.id)).map(r => parseInt(r.id))
        return {
            enabled: false,
            name: ft.name,
            revision: Math.max(...avail),
            availableRevisions: avail
        } as VariantFeature
    });

    const [features, setFeatures] = useState<VariantFeature[]>(initFeatures);

    /*  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
       const form = event.currentTarget;
   
       event.preventDefault();
       event.stopPropagation();
   
       console.log("valid" + name + nameIsValid())
       console.log(appState.repository.variants.filter(v => v.name === name))
       if (form.checkValidity() === true && nameIsValid()) {
         console.log("creating")
         CommunicationService.getInstance().createVariant(appState.repository, name, description, config).then((apiData: RepositoryResponse) => {
           setAppState((previousState) => ({
             ...previousState,
             repository: apiData.data
           }));
         });
         onModalDismiss();
       }
       setValidated(true);
     }; */

    let config = features.filter(ft => ft.enabled).map(ft => ft.name + '.' + ft.revision).join(', ');
    /* let nameIsValid = () => name.length > 0 && appState.repository.variants.filter(v => v.name.toLowerCase() === name.toLowerCase()).length < 1;
   */
    return (
        <>
            <Form.Group key={3}>
                <Form.Label>Features</Form.Label>
                {features.map((ft, i) => (
                    <>
                        <Row>
                            <Col xs={10}>
                                <Form.Check id={i.toString()} className='my-1'>
                                    <Form.Check.Input isInvalid={features.filter(f => f.enabled).length < 1} // counterintuitive
                                        onChange={() => {
                                            var changedFeatures = [...features]
                                            changedFeatures[i].enabled = !ft.enabled;
                                            changedFeatures[i].revision = changedFeatures[i].enabled ? changedFeatures[i].revision : 1
                                            setFeatures(changedFeatures);
                                        }}
                                    />
                                    <Form.Check.Label>{ft.name}</Form.Check.Label>
                                    {(i === features.length - 1) && <Form.Control.Feedback type="invalid">Select at least one feature!</Form.Control.Feedback>}
                                </Form.Check>
                            </Col>
                            <Col>
                                {ft.enabled &&
                                    <SpinButtonGroup
                                        value={ft.revision}
                                        min={Math.min(...ft.availableRevisions)}
                                        max={Math.max(...ft.availableRevisions)}
                                        onChange={value => {
                                            var changedFeatures = [...features]
                                            let oldRevivision = ft.revision
                                            let oldIndex = ft.availableRevisions.indexOf(oldRevivision)
                                            changedFeatures[i].revision = ft.availableRevisions[oldIndex + value];
                                            setFeatures(changedFeatures);
                                        }}
                                    />
                                    /*   <input
                                        type='number'
                                        className='form-control form-control-sm no-validation'
                                        min={Math.min(...ft.availableRevisions)}
                                        max={Math.max(...ft.availableRevisions)}
                                        value={ft.revision}
                                        disabled={!ft.enabled}
                                        onChange={event => {
                                          var changedFeatures = [...features]
                                          let oldRevivision = ft.revision
                                          let oldIndex = ft.availableRevisions.indexOf(oldRevivision)
                                          let diff = parseInt(event.target.value) - oldRevivision
                                          changedFeatures[i].revision = ft.availableRevisions[oldIndex + diff];
                                          setFeatures(changedFeatures);
                                        }} 
                                      />}*/
                                }
                            </Col>
                        </Row>
                    </>))
                }
            </Form.Group>
        </>
    );
}