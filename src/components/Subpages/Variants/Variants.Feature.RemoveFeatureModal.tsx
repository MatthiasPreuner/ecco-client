import * as React from "react";
import { useState } from "react";
import { Button, Modal, Badge, Col, Form } from 'react-bootstrap';
import { AppState, useSharedState } from "../../../states/AppState";

import { VariantModel } from "../../../model/VariantModel";
import { DeleteVariantModal } from "./Variants.DeleteVariantModal";
import { FeatureRevisionModel } from "../../../model/FeatureRevisionModel";
import { FeatureModel } from "../../../model/FeatureModel";

export const RemoveFeatureModal: React.FC<{ variant: VariantModel, featureRevision: FeatureRevisionModel }> = (props) => {

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  let [name, setName] = useState<string>(null);
  let [appState, setAppState] = useSharedState();

  let onModalDismiss = () => {
    setName('');
    handleClose();
  }

  let removeFeature = () => {
    // TODO
    setName('');
    handleClose();
  }

  return (
    <>
      <Badge bg="primary" className='btn ms-1' pill onClick={handleShow}><i className="bi bi-x-lg"></i></Badge>

      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        className="no-user-select"
      >
        <Modal.Header closeButton>
          <Modal.Title>Remove Feature</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form className="w-80">
            <Form.Group className="mb-3">
              <Form.Label>Feature '{props.featureRevision.featureRevisionString.split('.')[0]}' will be removed from Variant '{props.variant.name}'. Are you sure?</Form.Label>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Col className="d-flex justify-content-between align-items-center">
            <Button variant="secondary" onClick={onModalDismiss}>Close</Button>
            <Button variant="primary" type="submit">Remove</Button>
          </Col>
        </Modal.Footer>
      </Modal>
    </>
  );
}