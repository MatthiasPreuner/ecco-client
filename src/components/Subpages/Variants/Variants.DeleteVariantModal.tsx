import * as React from "react";
import { useState } from "react";
import { Button, Modal, Form } from 'react-bootstrap';

import { useSharedState } from "../../../states/AppState";
import { VariantModel } from "../../../model/VariantModel";
import { CommunicationService } from "../../../services/CommunicationService";
import { RepositoryResponse } from "../../../model/RepositoryResponse";
import { AxiosError } from "axios";
import { ErrorResponseToast } from "../../common/ErrorResponseToast";
import { LoadingButton } from "../../common/LoadingButton";

export const DeleteVariantModal: React.FC<{ variant: VariantModel }> = (props) => {

  const [show, setShow] = useState(false);
  const [errorResponse, setErrorResponse] = useState<AxiosError>();
  const [removing, setRemoving] = useState<boolean>(false);

  const [appState, setAppState] = useSharedState();

  const handleShow = () => setShow(true);

  const handleClose = () => {
    setErrorResponse(null)
    setRemoving(false)
    setShow(false);
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    console.log("rm")
    event.preventDefault();
    setRemoving(true);

    CommunicationService.getInstance().deleteVariant(appState.repository, props.variant).then((apiData: RepositoryResponse) => {
      setAppState((previousState) => ({ ...previousState, repository: apiData.data }));
      handleClose();
    }, (e: AxiosError) => {
      setErrorResponse(e);
      setRemoving(false);
    })
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
        <Form className="w-80" onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Variant '{props.variant?.name}' will be permanently removed.</Form.Label>
            </Form.Group>
            <ErrorResponseToast error={errorResponse} />
          </Modal.Body>
          <Modal.Footer className="d-flex justify-content-between">
            <Button variant="secondary" onClick={handleClose}>Close</Button>
            <LoadingButton loading={removing} variant="primary" type="submit">Remove</LoadingButton>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
}