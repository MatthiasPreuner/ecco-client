import * as React from "react";
import { useEffect, useState } from "react";
import { Button, Modal, Form } from 'react-bootstrap';
import { RepositoryHeaderModel, RepositoryModel } from "../../../model/RepositoryModel";
import { RepositoryHeaderResponse } from "../../../model/AvailableRepositoryResponse";
import { CommunicationService } from "../../../services/CommunicationService";
import { useSharedState } from "../../../states/AppState";
import { FeatureSelector, FeatureSelectorFeature } from "../../common/FeatureSelector";
import { RepositoryResponse } from "../../../model/RepositoryResponse";

export const ForkRepoModal: React.FC<{ repo: RepositoryHeaderModel }> = (props) => {

  const [show, setShow] = useState(false);
  const [inputValue, setInputValue] = useState<string>("");
  const [appState, setAppState] = useSharedState();
  const [validated, setValidated] = useState(false);
  const [repoToClone, setRepoToClone] = useState<RepositoryModel>(null)
  const [configString, setConfigString] = useState<string>("")
  const [initFeatures, setInitFeatures] = useState<FeatureSelectorFeature[]>([])

  const handleShow = () => {
    setShow(true);
    openRepo();
  }
  const handleClose = () => {
    // clear form
    setInputValue("");
    setValidated(false);
    setShow(false);
    setRepoToClone(null);
    setConfigString("");
  }

  let nameEmpty = () => !(inputValue?.length > 0);
  let nameExists = () => appState.availableRepositories.filter(v => v.name.toLowerCase() === inputValue.toLowerCase()).length > 0;
  let nameIsValid = () => !nameEmpty() && !nameExists();

  let openRepo = () => {
    CommunicationService.getInstance().getRepository(props.repo).then((apiData: RepositoryResponse) => setRepoToClone(apiData.data))
  }

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

  useEffect(() => {
    let f = repoToClone?.features.map(ft => {
      let avail = ft.revisions.sort((a, b) => Number(a.id) - Number(b.id)).map(r => parseInt(r.id))
      return {
        enabled: false,
        name: ft.name,
        revision: Math.max(...avail),
        availableRevisions: avail
      } as FeatureSelectorFeature
    });
    setInitFeatures(f);
  }, [repoToClone]);

  return (
    <>
      <Button variant="primary" onClick={handleShow} className="w-100" disabled={props.repo === null}>
        Fork <i className="bi bi-diagram-2-fill"></i>
      </Button>

      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        className="no-user-select"
      >
        <Modal.Header closeButton>
          <Modal.Title>Fork Repository</Modal.Title>
        </Modal.Header>
        <Form className="w-80" noValidate validated={validated} onSubmit={cloneRepo}>
          <Modal.Body>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>A new fork of '{props.repo?.name}' will be created.<br/>Please enter a name for the new repository:</Form.Label>
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
            <Form.Group className="mb-3">
              <Form.Label>Features</Form.Label>
              <FeatureSelector features={initFeatures} disableRevisions onChange={s => setConfigString(s)} />
            </Form.Group>
            <Form.Group className="mt-3" key={4}>
              <Form.Label>Configuration</Form.Label>
              <Form.Control type="text" disabled value={configString} />
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