import * as React from "react";
import { useState, useEffect } from "react";
import { AppState, useSharedState } from "../../../states/AppState";
import { FeatureModel } from "../../../model/FeatureModel";
import { CommunicationService } from "../../../services/CommunicationService";
import { FeatureRevisionModel } from "../../../model/FeatureRevisionModel";

import { Button} from 'react-bootstrap';
import { RepositoryResponse } from "../../../model/RepositoryResponse";

interface FeatureDetailRevisionDetailProps {
    featureRevision: FeatureRevisionModel
    feature: FeatureModel
}

export const FeatureRevisionDetail: React.FC<FeatureDetailRevisionDetailProps> = ({ featureRevision, feature }) => {

    const [successButtonDisabled, setSuccessButtonDisabled] = useState<boolean>(true);
    const [resetButtonDisabled, setResetButtonDisabled] = useState<boolean>(true);
    const [appState, setAppState] = useSharedState();
    const [tmpFeatureRevisionDescription, setTmpFeatureRevisionDescription] = useState<string>(featureRevision.description);

    useEffect(() => {
         setTmpFeatureRevisionDescription(featureRevision?.description);
    }, [feature, featureRevision, appState.availableRepositories]);

    const changeFeatureDescription = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        event.persist();
        setSuccessButtonDisabled(featureRevision.description === event.target.value)
        setResetButtonDisabled(featureRevision.description === event.target.value)
        setTmpFeatureRevisionDescription(event.target.value);
    }

    const saveChanges = () => {
        setSuccessButtonDisabled(true);
        setResetButtonDisabled(true);

        CommunicationService.getInstance().updateFeatureRevisionDescription(feature, featureRevision, tmpFeatureRevisionDescription)
            .then((apiData: RepositoryResponse) => {
                setAppState((previousState) => ({
                    ...previousState,
                    repository: apiData.data
                }));
                setTmpFeatureRevisionDescription(featureRevision?.description);
            });
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
                <Button size='sm' variant='secondary' disabled={resetButtonDisabled} onClick={resetChangesToInitialState}>Reset <i className="bi bi-trash3-fill"></i></Button>
                <Button size='sm' variant='primary' disabled={successButtonDisabled} onClick={saveChanges}>Save <i className="bi bi-save2-fill"></i></Button>
            </div>
        </>
    );

}
