import * as React from "react";
import { useSharedState } from "../../../states/AppState";
import { Button, Modal, Form } from 'react-bootstrap';
import { CommunicationService } from "../../../services/CommunicationService";
import { RepositoryHeaderResponse } from "../../../model/AvailableRepositoryResponse";

export default class RepoModal extends React.Component<{}, { show: boolean, inputValue: string, validated: boolean }> {

    constructor(props: any) {
        super(props);

        this.state = {
            show: false,
            inputValue: '',
            validated: false
        };
        const [appState, setAppState] = useSharedState();
    }

    handleClose() { this.setState({ show: false, inputValue: '', validated: false }) };
    handleShow() { this.setState(prevState => ({ ...prevState, show: true })) }

    createRepo(event: React.FormEvent<HTMLFormElement>) {
        const form = event.currentTarget;

        event.preventDefault();
        event.stopPropagation();

        if (form.checkValidity() === false || !this.nameIsValid()) {

            this.setState(prevState => ({ ...prevState, validated: true }))

        } else {

            /*     CommunicationService.getInstance().createRepository(inputValue).then((apiData: RepositoryHeaderResponse) => {
                    this.setAppState((previousState) => ({
                        ...previousState,
                        availableRepositories: apiData.data
                    }));
                }); */

            this.handleClose();
        }
    };

    nameEmpty(): boolean { return !(this.state.inputValue?.length > 0) }

    nameExists(): boolean {
        return true; //this.appState.availableRepositories.filter(v => v.name.toLowerCase() === this.state.inputValue.toLowerCase()).length > 0;
    }

    nameIsValid(): boolean { return !this.nameEmpty() && !this.nameExists(); }

    render() {
        return (
            <>
                <Button variant="primary" onClick={this.handleShow}>
                    Create <i className="bi bi-folder-plus"></i>
                </Button>

                <Modal
                    show={this.state.show}
                    onHide={this.handleClose}
                    backdrop="static"
                    keyboard={false}
                    className="no-user-select"
                >
                    <Modal.Header closeButton>
                        <Modal.Title>Create Repository</Modal.Title>
                    </Modal.Header>
                    <Form className="w-80" noValidate validated={this.state.validated} onSubmit={this.createRepo}>
                        <Modal.Body>
                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                <Form.Label>A new empty Repository will be created. Please enter a name:</Form.Label>
                                <Form.Control
                                    type="text"
                                    isInvalid={!this.nameIsValid()}
                                    isValid={this.nameIsValid()}
                                    placeholder="Name of the new Repository..."
                                    pattern="[A-Za-z0-9_]{1,}" value={this.state.inputValue}
                                    onChange={(e) => this.setState(prevState => ({ ...prevState, inputValue: e.target.value }))} />
                                {this.state.validated ?
                                    (this.nameEmpty() ?
                                        <Form.Control.Feedback type="invalid">Name must not be empty!</Form.Control.Feedback> :
                                        this.nameExists() ? <Form.Control.Feedback type="invalid">Name already exists!</Form.Control.Feedback> :
                                            < Form.Control.Feedback type="invalid">Invalid Name!</Form.Control.Feedback>)
                                    : null
                                }
                            </Form.Group>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={this.handleClose}>Close</Button>
                            <Button variant="primary" type="submit">Create Repository</Button>
                        </Modal.Footer>
                    </Form>
                </Modal>
            </>
        );
    }
}