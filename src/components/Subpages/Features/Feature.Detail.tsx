import * as React from "react";
import { AppState, useSharedState } from "../../../states/AppState";
import { useEffect, useState } from "react";
import { FeatureModel } from "../../../model/FeatureModel";
import { CommunicationService } from "../../../services/CommunicationService";
import { FeatureRevisionList } from "./Feature.Detail.RevisionList";

import { Button } from 'react-bootstrap';
import { RepositoryResponse } from "../../../model/RepositoryResponse";

interface DetailViewProps {
    currentSelectedFeatureModel: FeatureModel
}

export const FeatureDetail: React.FC<DetailViewProps> = ({ currentSelectedFeatureModel: selectedFeature }) => {

    const [successButtonDisabled, setSuccessButtonDisabled] = useState<boolean>(true);
    const [resetButtonDisabled, setResetButtonDisabled] = useState<boolean>(true);
    const [appState, setAppState] = useSharedState();
    const [tmpFeatureDescription, setTmpFeatureDescription] = useState<string>(selectedFeature?.description);

    useEffect(() => {
        setTmpFeatureDescription(selectedFeature?.description);
    }, [selectedFeature]);

    const saveChanges = () => {
        setSuccessButtonDisabled(true);
        setResetButtonDisabled(true);

        CommunicationService.getInstance().updateFeatureDescription(appState.repository, selectedFeature, tmpFeatureDescription)
            .then((apiData: RepositoryResponse) => {
                console.log(apiData.data);
                setAppState((previousState) => ({
                    ...previousState,
                    repository: apiData.data
                }));
            });
    }


    /*   useEffect(() => {
          //...dann wurde eine Kopie von tmpCurrentFeature gemacht und die neue Description aus dem Textarea
          // wird in das neue Objekt reingeschrieben, erst dann will ich den Request raussenden...
          CommunicationService.getInstance().updateFeatureInBackend(currentSelectedFeatureModel).then((apiData: FeatureResponse) => {
              setAppState((previousState: AppState) => ({
                  ...previousState,
                  features: apiData.data
              }));
          }).catch((error) => {
              console.log(error);
          }).finally(() => {
  
          });
      }, [appState.currentFeature.description]); */

    /* useEffect(() => {
        setTmpCurrentFeatureModel(currentSelectedFeatureModel);
    }, [currentSelectedFeatureModel]); */

    const changeFeatureDescription = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        event.persist();
        setSuccessButtonDisabled(selectedFeature.description == event.target.value)
        setResetButtonDisabled(selectedFeature.description == event.target.value)
        setTmpFeatureDescription(event.target.value);
    }

    const resetChangesToInitialState = () => {
        setTmpFeatureDescription(selectedFeature?.description);
        setSuccessButtonDisabled(true);
        setResetButtonDisabled(true);
    }

    return (
        selectedFeature != null &&

        <>
            <h4>Feature: {selectedFeature.name}</h4>
            <div className="m-2">
                <label htmlFor={selectedFeature.name}>Description of {selectedFeature.name}</label>
                <textarea id={selectedFeature.name}
                    value={(tmpFeatureDescription == null ? "" : tmpFeatureDescription)}
                    className={"form-control"}
                    onChange={changeFeatureDescription} />
            </div>
            <div className="m-2 d-flex justify-content-between">
                <Button size='sm' variant="secondary" disabled={resetButtonDisabled} onClick={resetChangesToInitialState}>Reset <i className="bi bi-trash3-fill"></i></Button>
                <Button size='sm' variant="primary" disabled={successButtonDisabled} onClick={saveChanges}>Save <i className="bi bi-save2-fill"></i></Button>
            </div>
            <FeatureRevisionList feature={selectedFeature} />
        </>
    );
};
