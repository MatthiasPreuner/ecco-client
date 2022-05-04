import * as React from "react";

import { Button, InputGroup } from 'react-bootstrap';

export interface IProps {
    value?: string | number | readonly string[],
    min?: number | string,
    max?: number | string,
    disabled?: boolean,
    style?: React.CSSProperties
    onChange?: (value: number) => void,
}

// maybe export styles to scss?
export const SpinButtonGroup: React.FC<IProps> = (props: IProps) => {
    return (
        <InputGroup size='sm' className="me-1" style={props.style}>
            <Button
                variant={props.disabled ? "secondary" : "primary"}
                disabled={props.disabled || props.value === props.min}
                onClick={() => props.onChange?.call(this, -1)}
                size='sm' style={{ padding: 0, width: '17px' }}>
                <i className="bi bi-caret-left"></i>
            </Button>
            <InputGroup.Text style={{ width: 'calc(100% - 34px)', display: 'flex', justifyContent: 'center' }}>{props.value}</InputGroup.Text>
            <Button
                variant={props.disabled ? "secondary" : "primary"}
                disabled={props.disabled || props.value === props.max}
                onClick={() => props.onChange?.call(this, +1)}
                size='sm'
                style={{ padding: 0, width: '17px' }}>
                <i className="bi bi-caret-right"></i>
            </Button>
        </InputGroup>
    );
}