import * as React from "react";
import { useState } from "react";
import { Button, Modal, Form } from 'react-bootstrap';
import { useSharedState } from "../../../states/AppState";

import { RepositoryHeaderModel } from "../../../model/RepositoryModel";
import { CommunicationService } from "../../../services/CommunicationService";
import { RepositoryHeaderResponse } from "../../../model/AvailableRepositoryResponse";

export const DeleteRepoModal: React.FC<{ repo: RepositoryHeaderModel }> = (props) => {

  const [show, setShow] = useState(false);

  const handleClose = () => {
    // clear form
    setInputValue('');
    setShow(false);
  }

  const handleShow = () => setShow(true);
  let onModalDismiss = () => { handleClose(); }

  let [inputValue, setInputValue] = useState<string>('');
  let [appState, setAppState] = useSharedState();

  let deleteRepo = (event: React.FormEvent<HTMLFormElement>) => {

    event.preventDefault();
    event.stopPropagation();

    if (inputValue !== "DELETE") return;

    CommunicationService.getInstance().deleteRepository(props.repo).then((apiData: RepositoryHeaderResponse) => {
      if (props.repo.repositoryHandlerId === appState.repository?.repositoryHandlerId) {
        setAppState((previousState) => ({ ...previousState, availableRepositories: apiData.data, repository: null }));
      } else {
        setAppState((previousState) => ({ ...previousState, availableRepositories: apiData.data }));
      }
    });

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
        <Form className="w-80" onSubmit={deleteRepo}>
          <Modal.Body>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Repository '{props.repo?.name}' will be permanently removed!</Form.Label>
              <Form.Control type="text" placeholder="Type 'DELETE' to confirm" value={inputValue} onChange={(e) => setInputValue(e.target.value)} />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={onModalDismiss}>Close</Button>
            <Button variant="primary" type="submit">Delete Repository</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
}