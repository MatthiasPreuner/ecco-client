import { FeatureRevisionModel } from "./FeatureRevisionModel";

export interface FeatureModel {
    id: string,
    name: string,
    description: string,
    /* featureRevisions: FeatureRevisionModel[], */
}

export const FeatureModelDefault: FeatureModel[] = [{
    id: '1',
    description: "desc",
    name: "person"
},
{
    id: '2',
    description: "desc",
    name: "purpleshirt"
},
{
    id: '3',
    description: "desc",
    name: "stripedshirt"
},
{
    id: '4',
    description: "desc",
    name: "jacket"
},
{
    id: '5',
    description: "desc",
    name: "glasses"
}
];