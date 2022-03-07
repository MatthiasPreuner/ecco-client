import { ApiData } from "./ApiData";
import { RepositoryModel } from "./RepositoryModel";

export interface RepositoryResponse extends ApiData {
    data: RepositoryModel
}