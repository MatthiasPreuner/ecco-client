import { FeatureRevisionModel } from "./FeatureRevisionModel";

export interface ConfigurationModel {
    featureRevisions: FeatureRevisionModel[],
    configurationString: string,
}
