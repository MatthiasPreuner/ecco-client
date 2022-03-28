import * as React from "react";
import { useState } from "react";
import { Button, Modal, Row, Col, Form } from 'react-bootstrap';
import { CommunicationService } from "../../../services/CommunicationService";
import { AppState, useSharedState } from "../../../states/AppState";

export const AddVariantFeatureModal: React.FC = () => {

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  let [name, setName] = useState<string>(null);
  let [appState, setAppState] = useSharedState();

  let onModalDismiss = () => {
    setName('');
    handleClose();
  }

  let addVariantFeature = () => {
/*     CommunicationService.getInstance().addVariantFeature(variant, feature).then((apiData: RepositoryResponse) => {
      setAppState((previousState) => ({
        ...previousState,
        repository: apiData.data
      }));
    });
    setName('');
    handleClose(); */
  

    addVariantFeature
    // TODO checks empty, exists, spacebar?
    // name not empty, name not exists
    // at least one feature??


/*     setAppState((prevState: AppState) => ({
      ...prevState,
      availableRepositories: [...appState.availableRepositories, name]
    })); */
    setName('');
    handleClose();
  }

  return (
    <>
      <Button variant="primary" className="w-100" onClick={handleShow}>Create Variant</Button>

      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        size='lg'
        className="no-user-select"
      >
        <Modal.Header closeButton>
          <Modal.Title>New Variant</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className='mb-3'>
              <Form.Label>Variant Name</Form.Label>
              <Form.Control type="text" placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Features</Form.Label>
              {appState.repository.features.map((ft, i) => (
                <>
                  <Row key={i}>
                    <Col xs={10}>
                      <Form.Check
                        id={i.toString()}
                        label={ft.name}
                      /* checked={ft.enabled} */
                      /*  onChange={event => {
                           var newConfigFeatures = [...configFeatures]
                           newConfigFeatures[i].enabled = !ft.enabled;
                           setConfigFeatures(newConfigFeatures);
                       }} */
                      />
                    </Col>
                    <Col>
                      <input
                        type='number'
                        className='form-control form-control-sm'
                        min={1}
                        max={100} // TODO current + 1
                      /*  value={ft.version}
                       disabled={!ft.enabled}
                       onChange={event => {
                           var newConfigFeatures = [...configFeatures]
                           newConfigFeatures[i].version = parseInt(event.target.value);
                           setConfigFeatures(newConfigFeatures); */
                      /*  }} */
                      />
                    </Col>
                  </Row>
                </>))
              }
            </Form.Group>

          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Col className="d-flex justify-content-between align-items-center">
            <Button variant="secondary" onClick={onModalDismiss}>Close</Button>
            <Button variant="primary" type="submit">Create</Button>
          </Col>
        </Modal.Footer>
      </Modal>
    </>
  );
}