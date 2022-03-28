import * as React from "react";
import { useState } from "react";
import { Button, Modal, Form } from 'react-bootstrap';
import { RepositoryHeaderModel } from "../../../model/RepositoryModel";

export const CloneRepoModal: React.FC<{ repo: RepositoryHeaderModel }> = (props) => {

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  let [inputValue, setInputValue] = useState<string>(null);

  const setValueInAppState = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  let onModalDismiss = () => {
    setInputValue(null);
    handleClose();
  }

  let cloneRepo = () => {

    // TODO checks empty, exists, spacebar?

   /*  setAppState((prevState: AppState) => ({
      ...prevState,
      availableRepositories: [...appState.availableRepositories, inputValue]
    })); */
    setInputValue(null);
    handleClose();
  }

  return (
    <>
      <Button variant="primary" onClick={handleShow} className="w-100" disabled={props.repo === null}>
        Clone <i className="bi bi-files"></i>
      </Button>

      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        className="no-user-select"
      >
        <Modal.Header closeButton>
          <Modal.Title>Clone Repository</Modal.Title>
        </Modal.Header>
        <Modal.Body>

          <Form className="w-80">
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>A new copy of '{props.repo?.name}' will be created. Please enter a name for the copy:</Form.Label>
              <Form.Control type="text" placeholder="Name of the new Repository..."  value={inputValue} onChange={setValueInAppState}/>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onModalDismiss}>Close</Button>
          <Button variant="primary" type="submit" onClick={cloneRepo}>Create Repository</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}