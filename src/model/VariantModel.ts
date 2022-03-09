import { ConfigurationModel } from "./ConfigurationModel";

export interface VariantModel {
    id: string,
    name: string,
    description: string,
    configuration: ConfigurationModel,
}
