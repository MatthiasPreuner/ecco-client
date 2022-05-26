import * as React from "react";
import { useState } from "react";
import { Button, Modal, Form } from 'react-bootstrap';
import { RepositoryHeaderResponse } from "../../../model/AvailableRepositoryResponse";
import { CommunicationService } from "../../../services/CommunicationService";
import { useSharedState } from "../../../states/AppState";

/* export default class ParentClass extends React.Component {

  constructor(props: any) {
    super(props);

    this.state = {
      count: 0
    };
  }



  render() {

    return false;

  }

} */

export const CreateRepoModal: React.FC = () => {

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

  let nameEmpty = () => !(formState.formValues.name?.length > 0);
  let nameExists = () => appState.availableRepositories.filter(v => v.name.toLowerCase() === inputValue.toLowerCase()).length > 0;
  let nameIsValid = () => !nameEmpty() && !nameExists();

  let createRepo = (event: React.FormEvent<HTMLFormElement>) => {
    const form = event.currentTarget;

    event.preventDefault();
    event.stopPropagation();
    console.log(nameIsValid())
    if (form.checkValidity() === false || !nameIsValid()) {

      setValidated(true);

    } else {

      CommunicationService.getInstance().createRepository(formState.formValues.name).then((apiData: RepositoryHeaderResponse) => {
        setAppState((previousState) => ({
          ...previousState,
          availableRepositories: apiData.data
        }));
      });

      handleClose();
    }
  };

  const [formState, setFormState] = useState({
    formValues: {
      name: "",
      password: ""
    },
    formErrors: {
      name: "",
      password: ""
    },
    formValidity: {
      name: false,
      password: false
    }
  });

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
    //const isPassword = name === "password";
    const nameTest = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
    validity[name as keyof typeof validity] = name.length > 0;

    fieldValidationErrors[name as keyof typeof fieldValidationErrors] = validity[name as keyof typeof validity]
      ? ""
      : `${name} is required and cannot be empty`; if (validity[name as keyof typeof validity]) {
        if (isName) {
          validity[name as keyof typeof validity] = appState.availableRepositories.filter(v => v.name.toLowerCase() === value.toLowerCase()).length < 1;
          fieldValidationErrors[name as keyof typeof fieldValidationErrors] = validity[name as keyof typeof validity]
            ? ""
            : `${name} already exists`;
        }
      } setFormState({
        ...formState,
        formErrors: fieldValidationErrors,
        formValidity: validity
      });
  };

  return (
    <>
      <Button variant="primary" onClick={handleShow}>
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
        <Form className="w-80" onSubmit={createRepo}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>A new empty Repository will be created. Please enter a name:</Form.Label>
              <input
                type="text"
                /*  isInvalid={false /* validated && !nameIsValid() */
                /*  isValid={false} */
                name="name"
                placeholder="Name of the new Repository..."
                pattern="[A-Za-z0-9_]{1,}"
                className={`form-control ${formState.formErrors.name ? "is-invalid" : ""}`}
                value={formState.formValues.name}
                onChange={handleChange}
              />
              <Form.Control.Feedback type="invalid">{formState.formErrors.name}</Form.Control.Feedback>
              {/*   {validated ?
                (nameEmpty() ?
                  <Form.Control.Feedback type="invalid">Name must not be empty!</Form.Control.Feedback> :
                  nameExists() ? <Form.Control.Feedback type="invalid">Name already exists!</Form.Control.Feedback> :
                    < Form.Control.Feedback type="invalid">Invalid Name!</Form.Control.Feedback>)
                : null
              } */}
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