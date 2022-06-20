import * as React from "react";
import { useState, useEffect } from "react";
import { Button, Modal, Form } from 'react-bootstrap';
import { useSharedState } from "../../../states/AppState";

import { CommunicationService } from "../../../services/CommunicationService";
import { RepositoryResponse } from "../../../model/RepositoryResponse";
import { FeatureSelector, FeatureSelectorFeature } from "../../common/FeatureSelector";
import { AxiosError } from "axios";
import { ErrorResponseToast } from "../../common/ErrorResponseToast";
import { LoadingButton } from "../../common/LoadingButton";



export const CreateVariant: React.FC = () => {

  const [show, setShow] = useState(false);
  const [name, setName] = useState<string>('');
  const [nameInvalid, setNameInvalid] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [appState, setAppState] = useSharedState();
  const [validated, setValidated] = useState(false);
  const [initFeatures, setInitFeatures] = useState<FeatureSelectorFeature[]>([])
  const [configString, setConfigString] = useState<string>("")
  const [errorResponse, setErrorResponse] = useState<AxiosError>();
  const [creating, setCreating] = useState<boolean>(false);

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
    setCreating(false);
    setErrorResponse(null);
    setConfigString("");
  }

  const handleShow = () => setShow(true);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    const form = event.currentTarget;

    event.preventDefault();
    event.stopPropagation();

    if (form.checkValidity()) {
      setCreating(true)
      CommunicationService.getInstance().createVariant(appState.repository, name, description, configString)
        .then((apiData: RepositoryResponse) => {
          setAppState((previousState) => ({ ...previousState, repository: apiData.data }));
          handleClose();
        }, (e: AxiosError) => {
          setErrorResponse(e);
          setCreating(false);
        })
    }
    setValidated(true);
  };

  // React.ChangeEvent<FormControlElement>
  const changeName = (e: any) => {

    let name = e.target.value;
    let invalid = "";
    // pattern="[A-Za-z0-9 _.]{1,}"
    if (name.length === 0) {
      invalid = "Name must not be empty."
    /* } else if (appState.repository.variants.filter(v => v.name.toLowerCase() === name.toLowerCase()).length > 0) {
      invalid = "A Variant with that Name already exists." */
    } else {
      invalid = ""
    }

    e.target.setCustomValidity(invalid)
    setNameInvalid(invalid)
    setName(name)
  }

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
              <Form.Control type="text"
                placeholder="Name"
                value={name}
                onChange={changeName} />
              <Form.Control.Feedback type="invalid">{nameInvalid}</Form.Control.Feedback>
            </Form.Group>
            <Form.Group className='mb-2' key={2}>
              <Form.Label>Description</Form.Label>
              <Form.Control as="textarea" rows={1} placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} />
            </Form.Group>
            <Form.Group key={3}>
              <Form.Label>Features</Form.Label>
              <FeatureSelector features={initFeatures} onChange={(enabled, disabled) => setConfigString(enabled)} />
            </Form.Group>
            <Form.Group className="mt-3" key={4}>
              <Form.Label>Configuration</Form.Label>
              <Form.Control type="text" disabled value={configString} />
            </Form.Group>
            <ErrorResponseToast error={errorResponse} />
          </Modal.Body>
          <Modal.Footer className="d-flex justify-content-between">
            <Button variant="secondary" onClick={handleClose}>Close</Button>
            <LoadingButton loading={creating} variant="primary" type="submit">Create</LoadingButton>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
}