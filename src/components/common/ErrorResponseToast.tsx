import { AxiosError } from "axios";
import * as React from "react";
import { Toast } from "react-bootstrap";

export interface ErrorResponseToastProps {
    error?: AxiosError,
}

export const ErrorResponseToast: React.FC<ErrorResponseToastProps> = (props) => {

    if (props.error === null || props.error === undefined) {
        return (<></>)
    } else {
        return (
            <Toast bg='warning' className="w-100">
            {/*     <Toast.Header closeButton={false}><b>{props.error.response.status}</b>&nbsp;{props.error.response.data.message}</Toast.Header> */}
                <Toast.Body >{props.error.response.data._embedded.errors[0].message}</Toast.Body>
            </Toast>
        )
    }




}