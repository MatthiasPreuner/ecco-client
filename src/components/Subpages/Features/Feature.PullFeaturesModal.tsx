import * as React from "react";
import { useEffect, useState } from "react";
import { Button, Modal, Form } from 'react-bootstrap';
import { RepositoryHeaderModel, RepositoryModel } from "../../../model/RepositoryModel";
import { CommunicationService } from "../../../services/CommunicationService";
import { useSharedState } from "../../../states/AppState";
import { FeatureSelector, FeatureSelectorFeature } from "../../common/FeatureSelector";
import { RepositoryResponse } from "../../../model/RepositoryResponse";
import { AxiosError } from "axios";
import { ErrorResponseToast } from "../../common/ErrorResponseToast";
import { LoadingButton } from "../../common/LoadingButton";

export const PullFeaturesModal: React.FC = () => {

  const [show, setShow] = useState(false);
  const [appState, setAppState] = useSharedState();
  const [validated, setValidated] = useState(false);
  const [repoToPullFrom, setRepoToPullFrom] = useState<RepositoryModel>(null)
  const [configString, setConfigString] = useState<[string, string]>(["", ""])
  const [initFeatures, setInitFeatures] = useState<FeatureSelectorFeature[]>([])
  const [errorResponse, setErrorResponse] = useState<AxiosError>(null);
  const [pulling, setPulling] = useState<boolean>(false);

  const handleShow = () => {
    setShow(true);
  }

  const handleClose = () => {
    // clear form
    setValidated(false);
    setShow(false);
    setErrorResponse(null);
    setRepoToPullFrom(null);
    setPulling(false);
    setConfigString(["", ""]);
  }

  let openRepo = (repo: RepositoryHeaderModel) => {
    CommunicationService.getInstance().getRepository(repo).then((apiData: RepositoryResponse) => {
      setRepoToPullFrom(apiData.data)
    }, (e: AxiosError) => {
      setErrorResponse(e);
    });
  }

  let handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    const form = event.currentTarget;

    event.preventDefault();
    event.stopPropagation();

    if (form.checkValidity() === false || repoToPullFrom === null || configString[1].length === 0) {

      setValidated(true);

    } else {
      setPulling(true)
      CommunicationService.getInstance().pullFeatures(appState.repository, repoToPullFrom.repositoryHandlerId, configString[1]).then((apiData: RepositoryResponse) => {
        setAppState((previousState) => ({ ...previousState, repository: apiData.data }));
        handleClose();
      }, (e: AxiosError) => {
        setErrorResponse(e);
        setPulling(false)
      });
    }
  };

  useEffect(() => {
    let f = repoToPullFrom?.features.map(ft => {
      let avail = ft.revisions.sort((a, b) => Number(a.id) - Number(b.id)).map(r => parseInt(r.id))
      return {
        enabled: false,
        name: ft.name,
        revision: Math.max(...avail),
        availableRevisions: avail
      } as FeatureSelectorFeature
    });
    setInitFeatures(f);
  }, [repoToPullFrom]);
  
  let repoOptions = appState.availableRepositories.filter(r => r.repositoryHandlerId !== appState.repository.repositoryHandlerId);

  return (
    <>
      <Button variant="primary" onClick={handleShow} className="w-100" disabled={appState.availableRepositories === null}>
        Pull Features <i className="bi bi-diagram-2-fill"></i>
      </Button>

      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        size='lg'
        className="no-user-select"
      >
        <Modal.Header closeButton>
          <Modal.Title>Pull Features</Modal.Title>
        </Modal.Header>
        <Form className="w-80" validated={validated} onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3" key={0} controlId="selectRepo">
              <Form.Label>Where do you want to pull features from?</Form.Label>             
              <Form.Select isInvalid={repoToPullFrom === null} onChange={e => openRepo(repoOptions[parseInt(e.target.value)-1])}>
                {repoToPullFrom == null &&
                  <option value={0} key={0}>Select repository</option>
                }
                {repoOptions.map((repo, idx) =>
                  (<option key={idx + 1} value={idx + 1}>{repo.name}</option>)
                )}
                <Form.Control.Feedback type="invalid">Select at valid Repository!</Form.Control.Feedback>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3" key={1}>
              <Form.Label>Features</Form.Label>
              <FeatureSelector features={initFeatures} disableRevisions onChange={(selected, deselected) => setConfigString([selected, deselected])} />
            </Form.Group>
            <Form.Group className="mt-3" key={2} >
              <Form.Label>Configuration</Form.Label>
              <Form.Control as="textarea" required rows={2} type="text" disabled value={configString[0]} />
            </Form.Group>
            <ErrorResponseToast error={errorResponse} />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>Close</Button>
            <LoadingButton loading={pulling} variant="primary" type="submit">Pull Features</LoadingButton>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
}