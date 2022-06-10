import * as React from "react";
import { Button, ButtonProps, Spinner } from "react-bootstrap";

export interface ErrorResponseToastProps {
    loading?: boolean,
    hidecontentwhileloading?: boolean
}

export const LoadingButton: React.FC<ErrorResponseToastProps & ButtonProps> = (props) => {
    return (
        <Button {...props} disabled={props.loading || props.disabled}>
            {props.loading &&
                <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                />}
            {!props.hidecontentwhileloading && props.loading && <>&nbsp;</>}
            {!(props.hidecontentwhileloading && props.loading) && <>{props.children}</>}
        </Button>
    )
}