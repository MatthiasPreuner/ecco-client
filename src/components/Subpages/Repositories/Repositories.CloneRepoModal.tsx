import * as React from "react";
import { useState } from "react";
import { Button, Modal, Form } from 'react-bootstrap';
import { RepositoryHeaderModel } from "../../../model/RepositoryModel";
import { RepositoryHeaderResponse } from "../../../model/AvailableRepositoryResponse";
import { CommunicationService } from "../../../services/CommunicationService";
import { useSharedState } from "../../../states/AppState";

export const CloneRepoModal: React.FC<{ repo: RepositoryHeaderModel }> = (props) => {

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

  let nameEmpty = () => !(inputValue?.length > 0);
  let nameExists = () => appState.availableRepositories.filter(v => v.name.toLowerCase() === inputValue.toLowerCase()).length > 0;
  let nameIsValid = () => !nameEmpty() && !nameExists();

  let cloneRepo = (event: React.FormEvent<HTMLFormElement>) => {
    const form = event.currentTarget;

    event.preventDefault();
    event.stopPropagation();

    if (form.checkValidity() === false || !nameIsValid()) {

      setValidated(true);

    } else {

      CommunicationService.getInstance().cloneRepository(props.repo, inputValue).then((apiData: RepositoryHeaderResponse) => {
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
        <Form className="w-80" noValidate validated={validated} onSubmit={cloneRepo}>
          <Modal.Body>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>A new copy of '{props.repo?.name}' will be created. Please enter a name for the copy:</Form.Label>
              <Form.Control
                type="text"
                isInvalid={!nameIsValid()}
                isValid={nameIsValid()}
                placeholder="Name of the new Repository..."
                pattern="[A-Za-z0-9_]{1,}" value={inputValue}
                onChange={(e) => setInputValue(e.target.value)} />
              {validated ?
                (nameEmpty() ?
                  <Form.Control.Feedback type="invalid">Name must not be empty!</Form.Control.Feedback> :
                  nameExists() ? <Form.Control.Feedback type="invalid">Name already exists!</Form.Control.Feedback> :
                    < Form.Control.Feedback type="invalid">Invalid Name!</Form.Control.Feedback>)
                : null
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