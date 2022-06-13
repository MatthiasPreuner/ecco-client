import * as React from "react";
import { Button, ButtonProps, Spinner } from "react-bootstrap";

export interface ErrorResponseToastProps {
    loading?: boolean,
    hideContentWhileLoading?: boolean
}

interface IProps extends ErrorResponseToastProps, ButtonProps {};

export const LoadingButton: React.FC<IProps> = (props) => {
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
            {!props.hideContentWhileLoading && props.loading && <>&nbsp;</>}
            {!(props.hideContentWhileLoading && props.loading) && <>{props.children}</>}
        </Button>
    )
}