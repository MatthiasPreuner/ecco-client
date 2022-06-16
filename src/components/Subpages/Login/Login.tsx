import * as React from "react";
import { useState, useEffect } from "react";
import { AppState, useSharedState } from "../../../states/AppState";
import { Form, Container } from 'react-bootstrap';
import { AxiosError } from "axios";

import { ErrorResponseToast } from "../../common/ErrorResponseToast";
import { LoadingButton } from "../../common/LoadingButton";
import { UserService } from "../../../services/UserService";


const BEARER_TOKEN: string = "bearertoken";

export const Login: React.FC = () => {

    const [appState, setAppState] = useSharedState();
    const [loggingIn, setLoggingIn] = useState<boolean>(false);
    const [errorResponse, setErrorResponse] = useState<AxiosError>(null);

    const defaultFormState = {
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

        // no validation at this point

        setFormState({
            ...formState,
            formErrors: fieldValidationErrors,
            formValidity: validity
        });
    };

    const checkAuthorized = () => {
        UserService.checkAuthorized().then((api: any) => {
            setAppState((prevState: AppState) => ({ ...prevState, userIsLoggedIn: true, loggedUserName: api.data.username }));
        }, (e: AxiosError) => {
            // just wait for logging in
        })
    };

    useEffect(() => {
        if (!appState.loggedUserName) {
            checkAuthorized();
        }
    }, [appState.loggedUserName]);

    const handleSubmit = () => {
        setLoggingIn(true)
        UserService.login(formState.formValues.name, formState.formValues.password).then((api: any) => {
            setAppState((prevState: AppState) => ({ ...prevState, userIsLoggedIn: true, loggedUserName: api.data.username }));
            setLoggingIn(false)
        }, (e: AxiosError) => {
            setErrorResponse(e)
            setLoggingIn(false);
        })
    };

    return (
        <Container className="vh-100 d-flex align-items-center justify-content-center">
            <Form className="w-80" /* onSubmit={handleSubmit} */>
                <legend>EccoHub Login</legend>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Control
                        type="email"
                        name="name"
                        placeholder="username"
                        value={formState.formValues.name}
                        onChange={handleChange} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Control
                        type="password"
                        name="password"
                        placeholder="password"
                        value={formState.formValues.password}
                        onChange={handleChange} />
                </Form.Group>
                <ErrorResponseToast error={errorResponse} />
                <LoadingButton className="w-100 mt-5" loading={loggingIn} variant="primary" type="button" onClick={handleSubmit}>Sign in</LoadingButton>
            </Form>
        </Container>
    );
}


