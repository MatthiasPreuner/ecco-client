import { FeatureRevisionModel } from "./FeatureRevisionModel";

export interface FeatureModel {
    id: string,
    name: string,
    description: string,
    revisions: FeatureRevisionModel[],
/*     latestRevision: FeatureRevisionModel */
}