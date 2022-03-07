import { CommitModel } from "./CommitModel";
import { FeatureModel } from "./FeatureModel";

export interface RepositoryModel {
/*     description: string, */
    name: string, 
    features: FeatureModel[],
    commits: CommitModel[], 
}