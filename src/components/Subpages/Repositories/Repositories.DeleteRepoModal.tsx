import * as React from "react";
import { useState } from "react";
import { Button, Modal, Form } from 'react-bootstrap';
import { AppState, useSharedState } from "../../../states/AppState";

import { RepositoryHeaderModel } from "../../../model/RepositoryModel";
import { CommunicationService } from "../../../services/CommunicationService";
import { RepositoryResponse } from "../../../model/RepositoryResponse";

export const DeleteRepoModal: React.FC<{ repo: RepositoryHeaderModel }> = (props) => {

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  let [inputValue, setInputValue] = useState<string>('');
  let [appState, setAppState] = useSharedState();

  let onModalDismiss = () => {
    setInputValue('');
    handleClose();
  }

  let deleteRepo = () => {
    if (inputValue !== "DELETE") return;

    CommunicationService.getInstance().deleteRepository(props.repo).then((apiData: RepositoryResponse) => {
      setAppState((previousState) => ({ ...previousState, repository: apiData.data }));
    });

    setInputValue(null);
    handleClose();
  }

  return (
    <>
      <Button variant="secondary" disabled={props.repo == null} onClick={handleShow}>Delete <i className="bi bi-trash3-fill"></i></Button>

      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        className="no-user-select"
      >
        <Modal.Header closeButton>
          <Modal.Title>Delete Repository</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form className="w-80">
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Repository '{props.repo?.name}' will be permanently removed!</Form.Label>
              <Form.Control type="text" placeholder="Type 'DELETE' to confirm" value={inputValue} onChange={(e) => setInputValue(e.target.value)} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onModalDismiss}>Close</Button>
          <Button variant="primary" onClick={deleteRepo}>Delete Repository</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}