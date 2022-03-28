import * as React from "react";
import { useState } from "react";
import { Button, Modal, Form } from 'react-bootstrap';
import { RepositoryHeaderResponse } from "../../../model/AvailableRepositoryResponse";
import { CommunicationService } from "../../../services/CommunicationService";
import { useSharedState } from "../../../states/AppState";

export const CreateRepoModal: React.FC = () => {

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  let [inputValue, setInputValue] = useState<string>(null);
  let [appState, setAppState] = useSharedState();

  const setValueInAppState = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  let onModalDismiss = () => {
    setInputValue(null);
    handleClose();
  }

  let createRepo = () => {
      CommunicationService.getInstance().createRepository(inputValue).then((apiData: RepositoryHeaderResponse) => {
          console.log(apiData.data);
          setAppState((previousState) => ({
              ...previousState,
              availableRepositories: apiData.data
          }));
      });
    setInputValue(null);
    handleClose();
  }

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
        <Modal.Body>

          <Form className="w-80">
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>A new empty Repository will be created. Please enter a name:</Form.Label>
              <Form.Control type="text" placeholder="Name of the new Repository..." pattern="[A-Za-z0-9_]{1,}" value={inputValue} onChange={setValueInAppState}/>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onModalDismiss}>Close</Button>
          <Button variant="primary" type="submit" onClick={createRepo}>Create Repository</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}