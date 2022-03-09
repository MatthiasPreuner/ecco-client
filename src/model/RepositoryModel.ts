import { CommitModel } from "./CommitModel";
import { FeatureModel } from "./FeatureModel";
import { VariantModel } from "./VariantModel";

export interface RepositoryModel {
/*     description: string, */
    name: string, 
    features: FeatureModel[],
    commits: CommitModel[],
    variants: VariantModel[], 
}