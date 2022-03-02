import { ApiData } from "./ApiData";
import { FeatureRevisionModel } from "./FeatureRevisionModel";

export interface FeatureRevisionResponse extends ApiData {
    data: FeatureRevisionModel[]
}