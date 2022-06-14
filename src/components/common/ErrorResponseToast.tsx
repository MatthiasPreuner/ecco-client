import { AxiosError } from "axios";
import * as React from "react";
import { Toast } from "react-bootstrap";

export interface ErrorResponseToastProps {
    error?: AxiosError,
}

export const ErrorResponseToast: React.FC<ErrorResponseToastProps> = (props) => {
    if (!props.error) {
        return (<></>)
    } else if (props.error.response === undefined) {
        // usually Network Error
        return (
            <Toast bg='warning' className="w-100">
                <Toast.Body >Network Error</Toast.Body>
            </Toast>
        )
    } else if (props.error.response.data._embedded && props.error.response.data._embedded.errors) { // specified by API
        return (
            <Toast bg='warning' className="w-100">
                <Toast.Body >{props.error.response.data._embedded.errors[0].message}</Toast.Body>
            </Toast>
        )
    } else { // not specified by API
        return (
            <Toast bg='warning' className="w-100">
                <Toast.Body ><b>{props.error.response.status}</b>&nbsp;{props.error.response.statusText}</Toast.Body>
            </Toast>
        )
    }
}