import { ApiData } from "./ApiData";
import { FeatureModel } from "./FeatureModel";

export interface FeatureResponse extends ApiData {
    data: FeatureModel[]
}