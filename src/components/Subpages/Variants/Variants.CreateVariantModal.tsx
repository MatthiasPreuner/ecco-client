import * as React from "react";
import { useState } from "react";
import { Button, Modal, Row, Col, Form } from 'react-bootstrap';
import { useSharedState } from "../../../states/AppState";

import { CommunicationService } from "../../../services/CommunicationService";
import { RepositoryResponse } from "../../../model/RepositoryResponse";
import { SpinButtonGroup } from "../../SpinButtonGroup";

interface VariantFeature {
  enabled: boolean,
  name: string,
  revision: number,
  availableRevisions: number[]
}

export const CreateVariant: React.FC = () => {

  const [show, setShow] = useState(false);
  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
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

  const handleClose = () => {
    // clear form
    setName('');
    setDescription('');
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
  };

  let config = features.filter(ft => ft.enabled).map(ft => ft.name + '.' + ft.revision).join(', ');
  let nameIsValid = () => name.length > 0 && appState.repository.variants.filter(v => v.name.toLowerCase() === name.toLowerCase()).length < 1;

  return (
    <>
      <Button variant="primary" className="w-100" disabled={appState.repository.features.length === 0} onClick={handleShow}>Create Variant</Button>

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
            <Form.Group className='mb-2' key={1}>
              <Form.Label>Name</Form.Label>
              <Form.Control type="text" isInvalid={!nameIsValid()} placeholder="Name" value={name} onChange={e => setName(e.target.value)} required pattern="[A-Za-z0-9 _.]{1,}" />
              {/*  isValid={nameIsValid()}  */}
              {/*    <Form.Control.Feedback type="valid">Looks good!</Form.Control.Feedback> */}
              {name.length < 1 ?
                <Form.Control.Feedback type="invalid">Name must not be empty!</Form.Control.Feedback> :
                <Form.Control.Feedback type="invalid">A Variant with that Name already exists!</Form.Control.Feedback>}
            </Form.Group>
            <Form.Group className='mb-2' key={2}>
              <Form.Label>Description</Form.Label>
              <Form.Control as="textarea" rows={1} placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} />
            </Form.Group>
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
            <Form.Group className="mt-3" key={4}>
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