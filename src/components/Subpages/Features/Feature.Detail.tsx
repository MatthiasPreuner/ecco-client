import * as React from "react";
import { AppState, useSharedState } from "../../../states/AppState";
import {useEffect, useState} from "react";
import { FeatureModel } from "../../../model/FeatureModel";
import {CommunicationService} from "../../../services/CommunicationService";
import {FeatureResponse} from "../../../model/FeatureResponse";
import {FeatureSpecificRevisionList} from "./Feature.Detail.RevisionList";

import { Container, Col, Row, InputGroup, FormControl, Button, Card, Accordion, Form, ListGroup } from 'react-bootstrap';

interface DetailViewProps {
    currentSelectedFeatureModel: FeatureModel
}

export const FeatureDetail : React.FC<DetailViewProps> = ({currentSelectedFeatureModel}) => {

    const [successButtonDisabled, setSuccessButtonDisabled] = useState<boolean>(true);
    const [resetButtonDisabled, setResetButtonDisabled] = useState<boolean>(true);
    const [appState, setAppState] = useSharedState();
    const [tmpCurrentFeatureModel, setTmpCurrentFeatureModel] = useState<FeatureModel>({
        id: currentSelectedFeatureModel.id,
        name: currentSelectedFeatureModel.name,
        description: currentSelectedFeatureModel.description
    });

    useEffect(() => {
        //...dann wurde eine Kopie von tmpCurrentFeature gemacht und die neue Description aus dem Textarea
        // wird in das neue Objekt reingeschrieben, erst dann will ich den Request raussenden...
        CommunicationService.getInstance().updateFeatureInBackend(tmpCurrentFeatureModel).then((apiData: FeatureResponse) => {
            setAppState((previousState: AppState) => ({
                ...previousState,
                features: apiData.data
            }));
        }).catch((error) => {
            console.log(error);
        }).finally(() => {

        });
    }, [appState.currentFeature.description]);

    useEffect(() => {
        setTmpCurrentFeatureModel(currentSelectedFeatureModel);
    }, [currentSelectedFeatureModel]);

    const changeFeatureDescription = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        event.persist();
        setSuccessButtonDisabled(currentSelectedFeatureModel.description == event.target.value)
        setResetButtonDisabled(currentSelectedFeatureModel.description == event.target.value)
        setTmpCurrentFeatureModel((previousState: FeatureModel) => ({
            ...previousState,
            description: event.target.value
        }));
    }

    const saveChangesInAppState = () => {
        // setAppState((previousState: AppState) => ({
        //     ...previousState,
        //     features: previousState.features.map(walkerFeature => (walkerFeature.name == tmpCurrentFeature.name) ?
        //         {...walkerFeature, description: tmpCurrentFeature.description} :
        //         walkerFeature
        //     )
        // }));
        setAppState((previousState: AppState) => ({
            ...previousState,
            currentFeature: tmpCurrentFeatureModel
        }));
        setSuccessButtonDisabled(true);
        setResetButtonDisabled(true);
    }

    const resetChangesToInitialState = () => {
        setTmpCurrentFeatureModel(currentSelectedFeatureModel);
        setSuccessButtonDisabled(true);
        setResetButtonDisabled(true);
    }

    return (
        <div className="row">
            <div className="col-12">
                <div className="m-3">
                    <label htmlFor={tmpCurrentFeatureModel.name}>Description of {tmpCurrentFeatureModel.name}</label>
                    <textarea id={tmpCurrentFeatureModel.name}
                              value={(tmpCurrentFeatureModel.description == null ? "" : tmpCurrentFeatureModel.description)}
                              className={"form-control"}
                              onChange={changeFeatureDescription} />
                </div>
                <div className="m-3 d-flex justify-content-between">
                    <Button variant="danger" disabled={resetButtonDisabled} onClick={resetChangesToInitialState}>Reset to Initial State</Button>
                    <Button variant="success" disabled={successButtonDisabled} onClick={saveChangesInAppState}>Save Changes</Button>
                </div>
            </div>
        </div>
    );
 };
