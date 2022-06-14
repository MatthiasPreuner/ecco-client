import * as React from "react";
import { useState } from "react";
import { Button, Modal, Form } from 'react-bootstrap';
import { RepositoryHeaderResponse } from "../../../model/AvailableRepositoryResponse";
import { CommunicationService } from "../../../services/CommunicationService";
import { useSharedState } from "../../../states/AppState";
import { AxiosError } from "axios";
import { ErrorResponseToast } from "../../common/ErrorResponseToast";
import { LoadingButton } from "../../common/LoadingButton";

export const CreateRepoModal: React.FC = () => {

  const [show, setShow] = useState(false);
  const [appState, setAppState] = useSharedState();
  const [errorResponse, setErrorResponse] = useState<AxiosError>();
  const [loading, setLoading] = useState<boolean>(false);

  const handleShow = () => setShow(true);

  const handleClose = () => {
    // clear form
    setFormState(defaultFormState);
    setErrorResponse(undefined);
    setLoading(false)
    // hide form
    setShow(false);
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const { formValues, formValidity } = formState;

    if (Object.values(formValidity).every(Boolean)) {
      // Form is valid
      setLoading(true);
      CommunicationService.getInstance().createRepository(formState.formValues.name).then((apiData: RepositoryHeaderResponse) => {
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

  return (
    <>
      <Button variant="primary" onClick={handleShow} disabled={!appState.availableRepositories}>
        Create <i className="bi bi-folder-plus"></i>
      </Button>

      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        className="no-user-select"
      >
        <Modal.Header closeButton>
          <Modal.Title>Create Repository</Modal.Title>
        </Modal.Header>
        <Form className="w-80" onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>A new empty repository will be created. Please enter a name:</Form.Label>
              <input
                type="text"
                name="name"
                placeholder="Name of the new Repository..."
                pattern="[A-Za-z0-9_]{1,}"
                className={`form-control ${formState.formErrors.name ? "is-invalid" : ""}`}
                value={formState.formValues.name}
                onChange={handleChange}
              />
              <Form.Control.Feedback type="invalid">{formState.formErrors.name}</Form.Control.Feedback>
            </Form.Group>
            <ErrorResponseToast error={errorResponse} />
          </Modal.Body>
          <Modal.Footer className="d-flex justify-content-between">
            <Button variant="secondary" onClick={handleClose}>Close</Button>
            <LoadingButton loading={loading} variant="primary" type="submit">Create Repository</LoadingButton>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
}