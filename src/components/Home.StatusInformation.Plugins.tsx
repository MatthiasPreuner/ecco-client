import * as React from "react";
import {ReducedArtifactPlugin} from "../Domain/Model/Backend/ReducedArtifactPlugin";

interface AccordionProperties {
    artifactPlugin: ReducedArtifactPlugin,
    parentID: string
}

interface AccordionBody {
    //wird das Elternelement darstellen, in dem diese Components enthalten sind
    parentID: string,
    artifactPlugin: ReducedArtifactPlugin
}

interface AccordionButton {
    //Wird die ID sein, die der Button triggern wird, damit der Inhalt darin angezeigt werden kann
    artifactPlugin: ReducedArtifactPlugin
}

export const StatusInformationPlugin : React.FC<AccordionProperties> = ({parentID , artifactPlugin}) => {

    return (
        <div className="card">
            <CollapseTriggerButton artifactPlugin={artifactPlugin} />
            <CollapseBody artifactPlugin={artifactPlugin} parentID={parentID} />
        </div>
    );
}

const CollapseTriggerButton : React.FC<AccordionButton> = ({artifactPlugin}) => {

    const validArtifactID = artifactPlugin.pluginID.replace(/[^a-zA-Z0-9]/g, '');

    return (
        <div className="card-header">
            <h2 className="mb-0">
                <button className="btn btn-link btn-block text-left" type="button" data-toggle="collapse" data-target={"#" + validArtifactID}>
                    <span>{artifactPlugin.pluginID}</span>
                    <span>{artifactPlugin.name}</span>
                </button>
            </h2>
        </div>
    )
}

const CollapseBody : React.FC<AccordionBody> = ({parentID, artifactPlugin }) => {

    const validArtifactID = artifactPlugin.pluginID.replace(/[^a-zA-Z0-9]/g, "");

    let changesInDescription = () => {
        console.log("Save button enabled...")
    }

    return (
        <div id={validArtifactID} className="collapse" data-parent={"#" + parentID}>
            <div className="card-body">
                <textarea inputMode={"text"}
                          className={"form-control"}
                          value={(artifactPlugin.description == null ? "" : artifactPlugin.description)}
                          onChange={changesInDescription}
                />
            </div>
        </div>
    )
}