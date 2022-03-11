import * as React from "react";
import { useState } from "react";
import { Button, Modal, Row, Col, Form } from 'react-bootstrap';
import { AppState, useSharedState } from "../../../states/AppState";

import { VariantModel } from "../../../model/VariantModel";
import { CommunicationService } from "../../../services/CommunicationService";
import { RepositoryResponse } from "../../../model/RepositoryResponse";

export const CreateVariant: React.FC = () => {

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  let [name, setName] = useState<string>(null);
  let [appState, setAppState] = useSharedState();

  let onModalDismiss = () => {
    setName('');
    setValidated(false);
    handleClose();
  }

  const [validated, setValidated] = useState(false);

  const handleSubmit = (event : React.FormEvent<HTMLFormElement>) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }

    setValidated(true);
  };


  let createVariant = () => {
    CommunicationService.getInstance().createVariant(name, null).then((apiData: RepositoryResponse) => {
      setAppState((previousState) => ({
        ...previousState,
        repository: apiData.data
      }));
    });
    setName('');
    handleClose();
  }

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
        <Form noValidate validated={validated}  onSubmit={handleSubmit}>
        <Modal.Body>
        
            <Form.Group className='mb-3'>
              <Form.Label>Variant Name</Form.Label>
              <Form.Control type="text" placeholder="Name" value={name} onChange={e => setName(e.target.value) } required/>
              <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
            </Form.Group>
            <Form.Group>
              <Form.Label>Features</Form.Label>
              {appState.repository.features.map((ft, i) => (
                <>
                  <Row key={i}>
                    <Col xs={10}>
                      <Form.Check
                        id={i.toString()}
                        label={ft.name}
                      /* checked={ft.enabled} */
                      /*  onChange={event => {
                           var newConfigFeatures = [...configFeatures]
                           newConfigFeatures[i].enabled = !ft.enabled;
                           setConfigFeatures(newConfigFeatures);
                       }} */
                      />
                    </Col>
                    <Col>
                      <input
                        type='number'
                        className='form-control form-control-sm'
                        min={1}
                        max={100} // TODO current + 1
                      /*  value={ft.version}
                       disabled={!ft.enabled}
                       onChange={event => {
                           var newConfigFeatures = [...configFeatures]
                           newConfigFeatures[i].version = parseInt(event.target.value);
                           setConfigFeatures(newConfigFeatures); */
                      /*  }} */
                      />
                    </Col>
                  </Row>
                </>))
              }
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