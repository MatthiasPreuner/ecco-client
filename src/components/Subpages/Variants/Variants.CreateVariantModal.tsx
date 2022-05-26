import * as React from "react";
import { useState, useEffect } from "react";
import { Button, Modal, Row, Col, Form } from 'react-bootstrap';
import { useSharedState } from "../../../states/AppState";

import { CommunicationService } from "../../../services/CommunicationService";
import { RepositoryResponse } from "../../../model/RepositoryResponse";
import { SpinButtonGroup } from "../../common/SpinButtonGroup";
import { FeatureSelector, FeatureSelectorFeature } from "../../common/FeatureSelector";

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
  const [initFeatures, setInitFeatures] = useState<FeatureSelectorFeature[]>([])
  const [configString, setConfigString] = useState<string>("")

  useEffect(() => {
    let f = appState.repository?.features.map(ft => {
      let avail = ft.revisions.sort((a, b) => Number(a.id) - Number(b.id)).map(r => parseInt(r.id))
      return {
        enabled: false,
        name: ft.name,
        revision: Math.max(...avail),
        availableRevisions: avail
      } as FeatureSelectorFeature
    });
    setInitFeatures(f);
  }, [appState.repository]);

  const handleClose = () => {
    // clear form
    setName('');
    setDescription('');
    setShow(false);
    setValidated(false);
    setConfigString("");
  }

  const handleShow = () => setShow(true);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    const form = event.currentTarget;

    event.preventDefault();
    event.stopPropagation();

    console.log("valid" + name + nameIsValid())
    console.log(appState.repository.variants.filter(v => v.name === name))
    if (form.checkValidity() === true && nameIsValid()) {
      console.log("creating")
      CommunicationService.getInstance().createVariant(appState.repository, name, description, configString[0]).then((apiData: RepositoryResponse) => {
        setAppState((previousState) => ({
          ...previousState,
          repository: apiData.data
        }));
      });
      handleClose();
    }
    setValidated(true);
  };

  let nameIsValid = () => name.length > 0 && appState.repository.variants.filter(v => v.name.toLowerCase() === name.toLowerCase()).length < 1;

  return (
    <>
      <Button variant="primary" className="w-100" disabled={appState.repository?.features.length === 0} onClick={handleShow}>Create Variant</Button>

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
              <FeatureSelector features={initFeatures} onChange={(enabled, disabled) => setConfigString(enabled)}/>
            </Form.Group>
            <Form.Group className="mt-3" key={4}>
              <Form.Label>Configuration</Form.Label>
              <Form.Control type="text" disabled value={configString} />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Col className="d-flex justify-content-between align-items-center">
              <Button variant="secondary" onClick={handleClose}>Close</Button>
              <Button variant="primary" type="submit">Create</Button>
            </Col>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
}