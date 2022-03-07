import { FeatureRevisionModel } from "./FeatureRevisionModel";

export interface FeatureModel {
    id: string,
    name: string,
    description: string,
    revisions: FeatureRevisionModel[],
/*     latestRevision: FeatureRevisionModel */
}

export const FeatureModelDefault: FeatureModel[] = [{
    id: '1',
    description: "desc",
    name: "person",
    revisions: []
},
{
    id: '2',
    description: "desc",
    name: "purpleshirt",
    revisions: []
},
{
    id: '3',
    description: "desc",
    name: "stripedshirt",
    revisions: []
},
{
    id: '4',
    description: "desc",
    name: "jacket",
    revisions: []
},
{
    id: '5',
    description: "desc",
    name: "glasses",
    revisions: []
}
];