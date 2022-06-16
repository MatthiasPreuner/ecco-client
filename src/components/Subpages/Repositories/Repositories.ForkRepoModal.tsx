import * as React from "react";
import { useEffect, useState } from "react";
import { Button, Modal, Form } from 'react-bootstrap';
import { RepositoryHeaderModel, RepositoryModel } from "../../../model/RepositoryModel";
import { RepositoryHeaderResponse } from "../../../model/AvailableRepositoryResponse";
import { CommunicationService } from "../../../services/CommunicationService";
import { useSharedState } from "../../../states/AppState";
import { FeatureSelector, FeatureSelectorFeature } from "../../common/FeatureSelector";
import { RepositoryResponse } from "../../../model/RepositoryResponse";
import { AxiosError } from "axios";
import { ErrorResponseToast } from "../../common/ErrorResponseToast";
import { LoadingButton } from "../../common/LoadingButton";

export const ForkRepoModal: React.FC<{ repo: RepositoryHeaderModel }> = (props) => {

  const [show, setShow] = useState(false);
  const [appState, setAppState] = useSharedState();
  const [repoToClone, setRepoToClone] = useState<RepositoryModel>(null)
  const [configString, setConfigString] = useState<[string, string]>(["", ""])
  const [initFeatures, setInitFeatures] = useState<FeatureSelectorFeature[]>([])
  const [errorResponse, setErrorResponse] = useState<AxiosError>();
  const [loading, setLoading] = useState<boolean>(false);

  const handleShow = () => {
    setShow(true);
    openRepo();
  }

  const handleClose = () => {
    // clear form
    setFormState(defaultFormState);
    setErrorResponse(null);
    setLoading(false)
    setRepoToClone(null);
    setConfigString(["", ""]);
    // hide form
    setShow(false);
  }

  let openRepo = () => {
    CommunicationService.getInstance().getRepository(props.repo).then((apiData: RepositoryResponse) => setRepoToClone(apiData.data))
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const { formValues, formValidity } = formState;

    if (Object.values(formValidity).every(Boolean)) {
      // Form is valid
      setLoading(true);
      CommunicationService.getInstance().forkRepository(props.repo, formValues.name, configString[1]).then((apiData: RepositoryHeaderResponse) => {
        setAppState((previousState) => ({
          ...previousState,
          availableRepositories: apiData.data
        }));
        handleClose();
      }, (e: AxiosError) => {setErrorResponse(e); setLoading(false)})
    } else {
      for (let key in formValues) {
        let target = {
          name: key,
          value: formValues[key as keyof typeof formValues]
        } as EventTarget & HTMLInputElement;
        handleValidation(target);
      }
    }
  };

  const defaultFormState = {
    formValues: {
      name: ""
    },
    formErrors: {
      name: ""
    },
    formValidity: {
      name: false
    }
  };

  const [formState, setFormState] = useState(defaultFormState);

  const handleChange = ({ target }: React.ChangeEvent<HTMLInputElement>) => {
    const { formValues } = formState;
    formValues[target.name as keyof typeof formValues] = target.value;
    setFormState(prev => ({ ...prev, formValues: formValues }));
    handleValidation(target);
  };

  const handleValidation = (target: EventTarget & HTMLInputElement) => {
    const { name, value } = target;
    const fieldValidationErrors = formState.formErrors;
    const validity = formState.formValidity;
    const isName = name === "name";

    if (isName) {

      fieldValidationErrors[name as keyof typeof fieldValidationErrors] = ``
      validity[name as keyof typeof validity] = false;

      if (value.length === 0) {
        fieldValidationErrors[name as keyof typeof fieldValidationErrors] = `Name is required and cannot be empty`
      } else if (/[^A-Za-z0-9_]+/.test(value)) {
        fieldValidationErrors[name as keyof typeof fieldValidationErrors] = `Name contains invalid characters`
      } else if (appState.availableRepositories.filter(v => v.name.toLowerCase() === value.toLowerCase()).length > 0) {
        fieldValidationErrors[name as keyof typeof fieldValidationErrors] = `Name already exists`
      } else {
        validity[name as keyof typeof validity] = true;
      }
    }

    setFormState({
      ...formState,
      formErrors: fieldValidationErrors,
      formValidity: validity
    });
  };

  useEffect(() => {
    let f = repoToClone?.features.map(ft => {
      let avail = ft.revisions.sort((a, b) => Number(a.id) - Number(b.id)).map(r => parseInt(r.id))
      return {
        enabled: true,
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
        <Form className="w-80" onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3" controlId="name">
              <Form.Label>A new fork of '{props.repo?.name}' will be created.<br/>Please enter a name for the new repository:</Form.Label>
              <input
                type="text"
                name="name"
                placeholder="Name of the new Repository..."
                className={`form-control ${formState.formErrors.name ? "is-invalid" : ""}`}
                value={formState.formValues.name}
                onChange={handleChange}
              />
              <Form.Control.Feedback type="invalid">{formState.formErrors.name}</Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Features</Form.Label>
              <FeatureSelector features={initFeatures} disableRevisions onChange={(enabled, disabled) => setConfigString([enabled, disabled])} />
            </Form.Group>
            <Form.Group className="mt-3" key={4}>
              <Form.Label>Configuration</Form.Label>
              <Form.Control as="textarea" rows={2} type="text" disabled value={configString[0]} />
            </Form.Group>
            <ErrorResponseToast error={errorResponse} />
          </Modal.Body>
          <Modal.Footer className="d-flex justify-content-between">
            <Button variant="secondary" onClick={handleClose}>Close</Button>
            <LoadingButton loading={loading} variant="primary" type="submit">Fork Repository</LoadingButton>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
}