import * as React from "react";
import { useState } from "react";
import { Button, Modal, Row, Col, Form } from 'react-bootstrap';
import { useSharedState } from "../../../states/AppState";

import { CommunicationService } from "../../../services/CommunicationService";
import { RepositoryResponse } from "../../../model/RepositoryResponse";
import { FeatureRevisionModel } from "../../../model/FeatureRevisionModel";

interface VariantFeature {
  enabled: boolean,
  name: string,
  version: number,
  revisions: FeatureRevisionModel[]
}

export const CreateVariant: React.FC = () => {

  const [show, setShow] = useState(false);
  const [name, setName] = useState<string>('');
  const [appState, setAppState] = useSharedState();
  const [validated, setValidated] = useState(false);

  const initFeatures = () => appState.repository.features.map(ft => {
    return {
      enabled: false,
      name: ft.name,
      version: 1,
      revisions: ft.revisions
    } as VariantFeature
  });

  const [features, setFeatures] = useState<VariantFeature[]>(initFeatures);

  const handleClose = () => {
    setName('');
    // clear form
    setShow(false);
    setValidated(false);
    setFeatures(initFeatures);
  }

  const handleShow = () => setShow(true);

  let onModalDismiss = () => {
    handleClose();
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    const form = event.currentTarget;

    event.preventDefault();
    event.stopPropagation();

    console.log("valid"+name  + nameIsValid())
    console.log(appState.repository.variants.filter(v => v.name === name))
    if (form.checkValidity() === true && nameIsValid()) {
      console.log("creating")
      CommunicationService.getInstance().createVariant(appState.repository, name, config).then((apiData: RepositoryResponse) => {
        setAppState((previousState) => ({
          ...previousState,
          repository: apiData.data
        }));
      });
      onModalDismiss();
    }
    setValidated(true);
  };

  let config = features.filter(ft => ft.enabled).map(ft => ft.name + '.' + ft.version).join(', ');

  let nameIsValid = () => name.length > 0 &&  appState.repository.variants.filter(v => v.name === name).length < 1;

  console.log(nameIsValid())
  return (
    <>
      <Button variant="primary" className="w-100" onClick={handleShow}>Create Variant</Button>

      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        size='lg'
        className="no-user-select"
      >
        <Modal.Header closeButton>
          <Modal.Title>New Variant</Modal.Title>
        </Modal.Header>
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className='mb-3' key={1}>
              <Form.Label>Variant Name</Form.Label>
              <Form.Control type="text" isInvalid={!nameIsValid()} placeholder="Name" value={name} onChange={e => setName(e.target.value)} required pattern="[A-Za-z0-9_]{1,}" />
             {/*  isValid={nameIsValid()}  */}
           {/*    <Form.Control.Feedback type="valid">Looks good!</Form.Control.Feedback> */}
              {name.length < 1 ?
                <Form.Control.Feedback type="invalid">Name must not be empty!</Form.Control.Feedback> :
                <Form.Control.Feedback type="invalid">Name already exists!</Form.Control.Feedback>}
            </Form.Group>
            <Form.Group key={2}>
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
                            changedFeatures[i].version = changedFeatures[i].enabled ? changedFeatures[i].version : 1
                            setFeatures(changedFeatures);
                          }}
                        />
                        <Form.Check.Label>{ft.name}</Form.Check.Label>
                        {(i === features.length -1) && <Form.Control.Feedback type="invalid">Select at least one feature!</Form.Control.Feedback>}
                      </Form.Check>
                    </Col>
                    <Col>
                      <input
                        type='number'
                        className='form-control form-control-sm'
                        min={1}
                        max={100} // TODO max latestRevision
                        value={ft.version}
                        disabled={!ft.enabled}
                        onChange={event => {

                          var changedFeatures = [...features]

                          if (Number(event.target.value) > ft.version) {
                            changedFeatures[i].version = ft.version + 1;
                          } else {
                            //down
                            changedFeatures[i].version = ft.version - 1;
                          }
                          setFeatures(changedFeatures);
                        }}
                      />
                    </Col>
                  </Row>
                </>))
              }
            </Form.Group>
            <Form.Group className="mt-3" key={3}>
              <Form.Label>Configuration</Form.Label>
              <Form.Control type="text" disabled value={config} />
            </Form.Group>

          </Modal.Body>
          <Modal.Footer>
            <Col className="d-flex justify-content-between align-items-center">
              <Button variant="secondary" onClick={onModalDismiss}>Close</Button>
              <Button variant="primary" type="submit">Create</Button>
            </Col>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
}