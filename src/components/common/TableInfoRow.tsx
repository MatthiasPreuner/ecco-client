import * as React from "react";

import './TableInfoRow.scss';

export interface TableInfoRowProps {
    message?: string,
}

export const TableInfoRow: React.FC<TableInfoRowProps> = (props) => {
    if (!props.message || props.message.length === 0) {
        return (<></>)
    } else {
        return (<tr className="info"><td><i>{props.message}</i></td></tr>)
    }
}