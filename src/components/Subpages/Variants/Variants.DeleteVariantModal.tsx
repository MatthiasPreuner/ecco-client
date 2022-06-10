import * as React from "react";
import { useState } from "react";
import { Button, Modal, Form } from 'react-bootstrap';

import { useSharedState } from "../../../states/AppState";
import { VariantModel } from "../../../model/VariantModel";
import { CommunicationService } from "../../../services/CommunicationService";
import { RepositoryResponse } from "../../../model/RepositoryResponse";

export const DeleteVariantModal: React.FC<{ variant: VariantModel }> = (props) => {

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  let [appState, setAppState] = useSharedState();

  let onModalDismiss = () => {
    handleClose();
  }

  let deleteVariant = () => {
    CommunicationService.getInstance().deleteVariant(appState.repository, props.variant).then((apiData: RepositoryResponse) => {
      setAppState((previousState) => ({
        ...previousState,
        repository: apiData.data
      }));
    });
    handleClose();
  }

  return (
    <>
      <Button className="w-100" variant="secondary" disabled={!props.variant} onClick={handleShow}>
        Remove Variant
      </Button>

      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        className="no-user-select"
      >
        <Modal.Header closeButton>
          <Modal.Title>Delete Variant</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form className="w-80">
            <Form.Group className="mb-3">
              <Form.Label>Variant '{props.variant?.name}' will be permanently removed.</Form.Label>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onModalDismiss}>Close</Button>
          <Button variant="primary" onClick={deleteVariant}>Remove Variant</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}