import * as React from "react";
import { useState } from "react";
import { FeatureModel } from "../../../model/FeatureModel";
import { CommunicationService } from "../../../services/CommunicationService";
import { FeatureRevisionModel } from "../../../model/FeatureRevisionModel";
import { FeatureRevisionResponse } from "../../../model/FeatureRevisionResponse";

import { Container, Col, Row, InputGroup, FormControl, Button, Card, Accordion, Form, ListGroup, ButtonGroup } from 'react-bootstrap';

interface FeatureDetailRevisionDetailProps {
    currentFeatureRevision: FeatureRevisionModel
    currentFeature: FeatureModel
}

export const FeatureSpecificRevisionDetail: React.FC<FeatureDetailRevisionDetailProps> = ({ currentFeatureRevision, currentFeature }) => {

    const [successButtonDisabled, setSuccessButtonDisabled] = useState<boolean>(true);
    const [resetButtonDisabled, setResetButtonDisabled] = useState<boolean>(true);
    const [tmpCurrentFeatureModel, setTmpCurrentFeatureModel] = useState<FeatureRevisionModel>({
        id: currentFeatureRevision.id,
        description: currentFeatureRevision.description,
        featureRevisionString: currentFeatureRevision.featureRevisionString
    });

    const changeFeatureDescription = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        event.persist();
        setSuccessButtonDisabled(currentFeatureRevision.description == event.target.value)
        setResetButtonDisabled(currentFeatureRevision.description == event.target.value)
        setTmpCurrentFeatureModel((previousState: FeatureRevisionModel) => ({
            ...previousState,
            description: event.target.value
        }));
    }

    const saveChangesInAppState = () => {
        setSuccessButtonDisabled(true);
        setResetButtonDisabled(true);
     /*    CommunicationService.getInstance().updateFeatureversionFromFeature(currentFeature, tmpCurrentFeatureModel).then(
            (featureVersionResponse: FeatureRevisionResponse) => { }); */
    }

    const resetChangesToInitialState = () => {
        setTmpCurrentFeatureModel(currentFeatureRevision);
        setSuccessButtonDisabled(true);
        setResetButtonDisabled(true);
    }

    return (
        <>
            <div className="mx-2">
                <label htmlFor={tmpCurrentFeatureModel.id}>Description of Featurerevision {tmpCurrentFeatureModel.id}</label>
                <textarea id={tmpCurrentFeatureModel.id}
                    value={(tmpCurrentFeatureModel.description == null ? "" : tmpCurrentFeatureModel.description)}
                    className={"form-control"}
                    onChange={changeFeatureDescription} />
            </div>
            <div className="m-2 d-flex justify-content-between">
                <Button size='sm' variant='danger' disabled={resetButtonDisabled} onClick={resetChangesToInitialState}>Reset</Button>
                <Button size='sm' variant='primary' disabled={successButtonDisabled} onClick={saveChangesInAppState}>Save</Button>
            </div>
        </>
    );

}
