import { AssociationModel } from "./AssociationModel";
import { ConfigurationModel } from "./ConfigurationModel";

export interface CommitModel {
    id: string,
    // configuration: config?
    commitMessage: string,
    username: string,
    date: string,
    configuration: ConfigurationModel,
    associations: AssociationModel[],
}
