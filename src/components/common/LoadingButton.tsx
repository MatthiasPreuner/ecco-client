import * as React from "react";
import { Button, ButtonProps, Spinner } from "react-bootstrap";

interface LoadingButtonProps extends ButtonProps {
    loading?: boolean,
    hideContentWhileLoading?: boolean
}

export const LoadingButton: React.FC<LoadingButtonProps> = (props) => {

    let { loading, hideContentWhileLoading, ...buttonProps } = props;

    return (
        <Button {...buttonProps} disabled={props.loading || props.disabled}>
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