import { ApiData } from "./ApiData";
import { RepositoryHeaderModel } from "./RepositoryModel";

export interface RepositoryHeaderResponse extends ApiData {
    data: RepositoryHeaderModel[]
}