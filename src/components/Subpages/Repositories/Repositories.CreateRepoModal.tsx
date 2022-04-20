import * as React from "react";
import { useState } from "react";
import { Button, Modal, Form } from 'react-bootstrap';
import { RepositoryHeaderResponse } from "../../../model/AvailableRepositoryResponse";
import { CommunicationService } from "../../../services/CommunicationService";
import { useSharedState } from "../../../states/AppState";

export const CreateRepoModal: React.FC = () => {

  const [show, setShow] = useState(false);
  const [inputValue, setInputValue] = useState<string>("");
  const [appState, setAppState] = useSharedState();
  const [validated, setValidated] = useState(false);

  const handleShow = () => setShow(true);

  const handleClose = () => {
    // clear form
    setInputValue("");
    setValidated(false);
    setShow(false);
  }

  let nameIsValid = () => inputValue.length > 0 && appState.availableRepositories.filter(v => v.name.toLowerCase() === inputValue.toLowerCase()).length < 1;

  let createRepo = (event: React.FormEvent<HTMLFormElement>) => {
    const form = event.currentTarget;

    if (form.checkValidity() === false || !nameIsValid()) {

      event.preventDefault();
      event.stopPropagation();
      setValidated(true);

    } else {

      CommunicationService.getInstance().createRepository(inputValue).then((apiData: RepositoryHeaderResponse) => {
        console.log(apiData.data);
        setAppState((previousState) => ({
          ...previousState,
          availableRepositories: apiData.data
        }));
      });

      handleClose();
    }
  };

  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        Create <i className="bi bi-folder-plus"></i>
      </Button>

      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        className="no-user-select"
      >
        <Modal.Header closeButton>
          <Modal.Title>Create Repository</Modal.Title>
        </Modal.Header>
        <Form className="w-80" noValidate validated={validated} onSubmit={createRepo}>
          <Modal.Body>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>A new empty Repository will be created. Please enter a name:</Form.Label>
              <Form.Control
                type="text"
                isInvalid={!nameIsValid()}
                isValid={nameIsValid()}
                placeholder="Name of the new Repository..."
                pattern="[A-Za-z0-9_]{1,}" value={inputValue}
                onChange={(e) => setInputValue(e.target.value)} />
              {validated ?
                (inputValue?.length < 1 ?
                <Form.Control.Feedback type="invalid">Name must not be empty!</Form.Control.Feedback> :
                <Form.Control.Feedback type="invalid">Name already exists!</Form.Control.Feedback>) : null
              }
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>Close</Button>
            <Button variant="primary" type="submit">Create Repository</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
}