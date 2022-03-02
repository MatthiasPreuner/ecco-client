import * as React from "react";
import {useState} from "react";
import {FeatureModel} from "../../../model/FeatureModel";
import {CommunicationService} from "../../../services/CommunicationService";
import {FeatureRevisionModel} from "../../../model/FeatureRevisionModel";
import {FeatureRevisionResponse} from "../../../model/FeatureRevisionResponse";

interface FeatureDetailRevisionDetailProps {
    currentFeatureRevision: FeatureRevisionModel
    currentFeature: FeatureModel
}

export const FeatureSpecificRevisionDetail : React.FC<FeatureDetailRevisionDetailProps> = ({currentFeatureRevision, currentFeature}) => {

    const [successButtonDisabled, setSuccessButtonDisabled] = useState<boolean>(true);
    const [resetButtonDisabled, setResetButtonDisabled] = useState<boolean>(true);
    const [tmpCurrentFeatureModel, setTmpCurrentFeatureModel] = useState<FeatureRevisionModel>({
        id: currentFeatureRevision.id,
        description: currentFeatureRevision.description
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
        CommunicationService.getInstance().updateFeatureversionFromFeature(currentFeature, tmpCurrentFeatureModel).then(
            (featureVersionResponse: FeatureRevisionResponse) => {});
    }

    const resetChangesToInitialState = () => {
        setTmpCurrentFeatureModel(currentFeatureRevision);
        setSuccessButtonDisabled(true);
        setResetButtonDisabled(true);
    }

    return (
        <>
            <div className="m-3">
                <label htmlFor={tmpCurrentFeatureModel.id}>Description of {tmpCurrentFeatureModel.id}</label>
                <textarea id={tmpCurrentFeatureModel.id}
                          value={(tmpCurrentFeatureModel.description == null ? "" : tmpCurrentFeatureModel.description)}
                          className={"form-control"}
                          onChange={changeFeatureDescription} />
            </div>
            <div className="m-3 d-flex justify-content-between">
                <button type={"button"} className={"btn btn-success"} disabled={successButtonDisabled} onClick={saveChangesInAppState}>
                    Save Changes Test
                </button>
                <button type={"button"} className={"btn btn-danger"} disabled={resetButtonDisabled} onClick={resetChangesToInitialState}>
                    Reset to Initial State TEST
                </button>
            </div>
        </>
    );

}
