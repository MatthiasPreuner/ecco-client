import * as React from "react";
import { useState } from "react";
import { FeatureModel } from "../../../model/FeatureModel";
import { CommunicationService } from "../../../services/CommunicationService";
import { FeatureRevisionModel } from "../../../model/FeatureRevisionModel";
import { FeatureRevisionResponse } from "../../../model/FeatureRevisionResponse";

import { Container, Col, Row, InputGroup, FormControl, Button, Card, Accordion, Form, ListGroup, ButtonGroup } from 'react-bootstrap';

interface FeatureDetailRevisionDetailProps {
    featureRevision: FeatureRevisionModel
    feature: FeatureModel
}

export const FeatureRevisionDetail: React.FC<FeatureDetailRevisionDetailProps> = ({ featureRevision, feature }) => {

    const [successButtonDisabled, setSuccessButtonDisabled] = useState<boolean>(true);
    const [resetButtonDisabled, setResetButtonDisabled] = useState<boolean>(true);
    const [tmpFeatureRevisionDescription, setTmpFeatureRevisionDescription] = useState<string>(featureRevision.description);

    const changeFeatureDescription = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        event.persist();
        setSuccessButtonDisabled(featureRevision.description == event.target.value)
        setResetButtonDisabled(featureRevision.description == event.target.value)

        setTmpFeatureRevisionDescription(event.target.value);
 /*        setTmpCurrentFeatureModel((previousState: FeatureRevisionModel) => ({
            ...previousState,
            description: event.target.value
        })); */
    }

    const saveChangesInAppState = () => {
        setSuccessButtonDisabled(true);
        setResetButtonDisabled(true);
     /*    CommunicationService.getInstance().updateFeatureversionFromFeature(currentFeature, tmpCurrentFeatureModel).then(
            (featureVersionResponse: FeatureRevisionResponse) => { }); */
    }

    const resetChangesToInitialState = () => {
        setTmpFeatureRevisionDescription(featureRevision.description);
        setSuccessButtonDisabled(true);
        setResetButtonDisabled(true);
    }

    return (
        <>
            <div className="mx-2">
                <label htmlFor={featureRevision.id}>Description of Featurerevision {featureRevision.id}</label>
                <textarea id={featureRevision.id}
                    value={(tmpFeatureRevisionDescription == null ? "" : tmpFeatureRevisionDescription)}
                    className={"form-control"}
                    onChange={changeFeatureDescription} />
            </div>
            <div className="m-2 d-flex justify-content-between">
                <Button size='sm' variant='secondary' disabled={resetButtonDisabled} onClick={resetChangesToInitialState}>Reset</Button>
                <Button size='sm' variant='primary' disabled={successButtonDisabled} onClick={saveChangesInAppState}>Save</Button>
            </div>
        </>
    );

}
