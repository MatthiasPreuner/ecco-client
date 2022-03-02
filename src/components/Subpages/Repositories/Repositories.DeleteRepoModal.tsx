import * as React from "react";
import { useState } from "react";
import { Button, Modal, Form } from 'react-bootstrap';
import { AppState, useSharedState } from "../../../states/AppState";

import { RepositoryModel } from "../../../model/RepositoryModel";

export const DeleteRepoModal: React.FC<{repo: RepositoryModel, btnDisabled: boolean}> = (props) => {

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

/*   let repo: string = "asd"; */

  let deleteRepo = () => {
    if (inputValue !== "DELETE") return;

    let newArray = [...appState.availableRepositories].filter(el => el != props.repo.name)

    setAppState((prevState: AppState) => ({
        ...prevState,
        availableRepositories: newArray
    }));
    setInputValue(null);
    handleClose();
}
 
  return (
    <>
      <Button variant="secondary" disabled={props.btnDisabled} onClick={handleShow}>
        Delete Repository
      </Button>

      {/* <Button variant="secondary" disabled={selectedRepo == null} onClick={deleteRepo}>Delete Repository</Button>
 */}
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
              <Form.Control type="text" placeholder="Type 'DELETE' to confirm"  value={inputValue} onChange={setValueInAppState}/>
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