import { CommitModel } from "./CommitModel";
import { FeatureModel } from "./FeatureModel";
import { VariantModel } from "./VariantModel";


export interface RepositoryHeaderModel {
    repositoryHandlerId: string
    name: string,
}

export interface RepositoryModel extends RepositoryHeaderModel {
    /*     description: string, */
    name: string,
    features: FeatureModel[],
    commits: CommitModel[],
    variants: VariantModel[],
}

