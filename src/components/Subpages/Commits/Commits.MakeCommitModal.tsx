import * as React from "react";
import { useState } from "react";
import { Button, Modal, Form, Row, Col } from 'react-bootstrap';
import { AppState, useSharedState } from "../../../states/AppState";

import { Dropzone } from "./Commits.MakeCommitModal.Dropzone";

export const MakeCommit: React.FC = () => {

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  let [commitMessage, setCommitMessage] = useState<string>(null);
  let [appState, setAppState] = useSharedState();

  let onModalDismiss = () => {
    setCommitMessage('');
    handleClose();
  }

  let makeCommit = () => {

    // TODO checks empty, exists, spacebar?

    setAppState((prevState: AppState) => ({
      ...prevState,
      availableRepositories: [...appState.availableRepositories, commitMessage]
    }));
    setCommitMessage('');
    handleClose();
  }

  return (
    <>
      <Button variant="primary" className="w-100" onClick={handleShow}>New Commit</Button>

      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        size='xl'
        className="no-user-select"
      >
        <Modal.Header closeButton>
          <Modal.Title>New Commit</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Dropzone />
            <Form.Group>
              <Form.Control as="textarea" rows={1} type="text" placeholder="Commit Message" value={commitMessage} onChange={e => setCommitMessage(e.target.value)} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Col className="d-flex justify-content-between align-items-center">
            <Button variant="secondary" onClick={onModalDismiss}>Close</Button>
            <Button variant="primary" type="submit">Commit</Button>
          </Col>
        </Modal.Footer>
      </Modal>
    </>
  );
}