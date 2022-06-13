/* import { OperationContainer } from "../Domain/Model/Frontend/OperationContainer";  */
import { RequestConfig } from "../model/RequestConfig";
import { FeatureModel } from "../model/FeatureModel";
import { FeatureRevisionModel } from "../model/FeatureRevisionModel";
import { VariantModel } from "../model/VariantModel";
import { FileWithPath } from "react-dropzone";
import { RepositoryHeaderModel, RepositoryModel } from "../model/RepositoryModel";
/* import {AssociationModel} from "../Domain/Model/Backend/AssociationModel";
import {AssociationInspection} from "../Domain/Model/Frontend/AssociationInspection";
import {ArtefactgraphFilter} from "../Domain/Model/Backend/ChartArtefactgraph/ArtefactgraphFilter"; */

/* import axios2 from 'axios';
axios2.defaults.baseURL = 'http://localhost:8080/api'
axios2.defaults.headers.common = {'Authorization': `bearer TOKEN`} */
/* export default axios; */

const axios = require("axios");

export class CommunicationService {

    private static readonly BASE_URI = "http://localhost:8080/api";
    private static readonly FEATURE_ENDPOINT = "/feature";
    private static readonly VARIANT_ENDPOINT = "/variant";
    /* private static readonly ARTIFACT_ENDPOINT = "/artefact";
    private static readonly ARTIFACT_GRAPH_ENDPOINT = "/graph";
    private static readonly ARTIFACT_UPDATED_GRAPH_ENDPOINT = "/updatedgraph"; */
    private static readonly REPOSITORY_ENDPOINT = "/repository";
    private static readonly ASSOCIATIONS_ENDPOINT = "/associations";
    private static readonly COMMIT_ENDPOINT = "/commit";
    private static readonly NUMBER_OF_ARTIFACTS_PER_ASSOCIATION_IN_ASSOCIATION_ENDPOINT = "/numberofartifacts";
    private static readonly NUMBER_OF_ARTIFACTS_PER_DEPTH_IN_ASSOCIATION_ENDPOINT = "/artifactsperdepth";
    private static readonly NUMBER_OF_REVISIONS_PER_FEATURE_IN_FEATURE_ENDPOINT = "/numberofrevisions";
    private static readonly NUMBER_OF_MODULES_PER_ORDER_IN_ASSOCIATION_ENDPOINT = "/modulesperorder";

    private static communicationServiceInstance: CommunicationService;

    private constructor() {
        axios.defaults.baseURL = CommunicationService.BASE_URI
        axios.defaults.headers.common['Authorization'] = `bearer TOKEN` // TODO
    }

    // Repository ======================================================================================
    public getAllRepositories(): Promise<any> {
        return axios.get(
            `${CommunicationService.REPOSITORY_ENDPOINT + '/all'}`
        )
    }

    public getRepository(repo: RepositoryHeaderModel): Promise<any> {
        return axios.get(
            `${CommunicationService.REPOSITORY_ENDPOINT}/${repo.rid}`
        )
    }

    public createRepository(name: string): Promise<any> {
        return axios.put(
            `${CommunicationService.REPOSITORY_ENDPOINT}/${name}`
        )
    }

    public cloneRepository(repo: RepositoryHeaderModel, name: string): Promise<any> {
        return axios.put(
            `${CommunicationService.REPOSITORY_ENDPOINT}/clone/${repo.rid}/${name}`
        )
    }

    public forkRepository(repo: RepositoryHeaderModel, name: string, deselectedFeatures: string): Promise<any> {
        let body = { deselectedFeatures: deselectedFeatures }
        let config = new RequestConfig();
        config.headers = {
            'Content-Type': 'application/json',
        };
        return axios.put(
            `${CommunicationService.REPOSITORY_ENDPOINT}/fork/${repo.rid}/${name}`,
            body,
            config
        )
    }

    public deleteRepository(repo: RepositoryHeaderModel): Promise<any> {
        return axios.delete(
            `${CommunicationService.REPOSITORY_ENDPOINT}/${repo.rid}`
        )
    }
    
     // Feature ========================================================================================
    public updateFeatureDescription(repository: RepositoryModel, currentFeatureModel: FeatureModel, description: string): Promise<any> {

 /*        Axios.post<any, any, { description: string;}>(url: string, data?: {  description: string;}, config?: AxiosRequestConfig<{ description: string;}>): Promise<any>
   */

        let body = { description: description }
        let config = new RequestConfig();
        config.headers = {
            'Content-Type': 'application/json',
        };
        return axios.post(
            `/${repository.rid + CommunicationService.FEATURE_ENDPOINT}/${currentFeatureModel.id + "/description"}`,
            body,
            config
        )
    }

    public updateFeatureRevisionDescription(repository: RepositoryModel, currentFeatureModel: FeatureModel, featureRevision: FeatureRevisionModel, description: string): Promise<any> {
        let body = { description: description }
        let config = new RequestConfig();
        config.headers = {
            'Content-Type': 'application/json',
        };
        return axios.post(
            `/${repository.rid + CommunicationService.FEATURE_ENDPOINT}/${currentFeatureModel.id}/${featureRevision.id + '/description'}`,
            body,
            config
        )
    }

    public pullFeatures(repository: RepositoryModel, fromRId: string, deselectedFeatures: string): Promise<any> {
        console.log("pull")
        let body = { fromRId: fromRId, deselectedFeatures: deselectedFeatures }
        let config = new RequestConfig();
        config.headers = {
            'Content-Type': 'application/json',
        };
        return axios.post(
            `/${repository.rid + CommunicationService.FEATURE_ENDPOINT}/pull`,
            body,
            config
        )
    }

    // Commits ========================================================================================
    public makeCommit = (repository: RepositoryModel, message: string, configuration: string, acceptedFiles: FileWithPath[]) => {

        let formData = new FormData();
        let config = new RequestConfig();

        acceptedFiles.forEach((tmpFile: FileWithPath) => {
            let path = tmpFile.path.substring(1) // remove starting '/'
            path = path.substring(path.indexOf('/')) // remove root folder
            formData.append("file", tmpFile, path);
        });

        formData.append("message", message)
        formData.append("config", configuration)
        config.headers = {
            'Content-Type': 'multipart/form-data'
        }
 
        console.log(`${CommunicationService.BASE_URI}/${repository.rid + CommunicationService.COMMIT_ENDPOINT}/add`)
        return axios.post(
            `/${repository.rid + CommunicationService.COMMIT_ENDPOINT}/add`,
            formData,
            config
        )
    }
    // Variants ========================================================================================
    public createVariant(repository: RepositoryModel, name: string, description: string, configuration: string): Promise<any> {
        let config = new RequestConfig();
        let body = { configuration: configuration, description: description }
        config.headers = {
            'Content-Type': 'application/json',
        };
        return axios.put(
            `/${repository.rid + CommunicationService.VARIANT_ENDPOINT}/${name}`,
            body,
            config
        )
    }

    public deleteVariant(repository: RepositoryModel, variant: VariantModel): Promise<any> {
        return axios.delete(
            `/${repository.rid + CommunicationService.VARIANT_ENDPOINT}/${variant.id}`,
        )
    }

    public updateVariant(repository: RepositoryModel, variant: VariantModel): Promise<any> {
        let body = { name: variant.name, description: variant.description }
        let config = new RequestConfig();
        config.headers = {
            'Content-Type': 'application/json',
        };
        return axios.post(
            `/${repository.rid + CommunicationService.VARIANT_ENDPOINT}/${variant.id}`,
            body
        )
    }

    public checkOutVariant(repository: RepositoryModel, variant: VariantModel): Promise<any> {
        return axios({
            url: `${CommunicationService.BASE_URI}/${repository.rid + CommunicationService.VARIANT_ENDPOINT}/${variant.id}/checkout`,
            method: 'GET',
            responseType: 'blob', // important
        })
    }

    // Variants / Features ========================================================================================
    public variantAddFeature(repository: RepositoryModel, variant: VariantModel, feature: FeatureModel): Promise<any> {
        return axios.put(
            `/${repository.rid + CommunicationService.VARIANT_ENDPOINT}/${variant.id}/${feature.id}`,
        )
    }

    public variantUpdateFeature(repository: RepositoryModel, variant: VariantModel, featureName: string, id: string): Promise<any> {
        let config = new RequestConfig();
        config.headers = {
            'Content-Type': 'text/plain',
        };
        return axios.post(
            `/${repository.rid + CommunicationService.VARIANT_ENDPOINT}/${variant.id}/${featureName}`,
            id,
            config
        )
    }

    public variantRemoveFeature(repository: RepositoryModel, variant: VariantModel, featureName: string): Promise<any> {
        return axios.delete(
            `/${repository.rid + CommunicationService.VARIANT_ENDPOINT}/${variant.id}/${featureName}`,
        )
    }

    // Other ========================================================================================
    public commitFilesInsideZIPFile = (acceptedFiles: File[]) => {
        let formData = new FormData();
        let config = new RequestConfig();
        acceptedFiles.forEach((tmpFile: File) => {
            formData.append("file", tmpFile, tmpFile.name);
        });
        config.headers = {
            'Content-Type': 'multipart/form-data'
        }
        return axios.post(
            `${CommunicationService.BASE_URI + CommunicationService.REPOSITORY_ENDPOINT + CommunicationService.COMMIT_ENDPOINT}`,
            formData,
            config
        )
    }

    /*   public updateArtifactgraphOnNodeID(nodeID: string, maxChildCount: number) : Promise<any> {
          let config = new RequestConfig();
          config.headers = {
              'Content-Type': 'application/json',
          };
          let artifactgraphFilter = new ArtefactgraphFilter(maxChildCount, nodeID);
          return axios.post(
              `${CommunicationService.BASE_URI + CommunicationService.ARTIFACT_ENDPOINT + CommunicationService.ARTIFACT_UPDATED_GRAPH_ENDPOINT}`,
              JSON.stringify(artifactgraphFilter),
              config
          )
      }
   */
    /*    public getArtifactgraph(artefactgraphFilter: ArtefactgraphFilter) : Promise<any> {
           let config = new RequestConfig();
           config.headers = {
               'Content-Type': 'application/json',
           };
           return axios.post(
               `${CommunicationService.BASE_URI + CommunicationService.ARTIFACT_ENDPOINT + CommunicationService.ARTIFACT_GRAPH_ENDPOINT}`,
               JSON.stringify(artefactgraphFilter),
               config
           )
       } */

    public getNumberOfModules(): Promise<any> {
        return axios.get(
            `${CommunicationService.BASE_URI + CommunicationService.ASSOCIATIONS_ENDPOINT + CommunicationService.NUMBER_OF_MODULES_PER_ORDER_IN_ASSOCIATION_ENDPOINT}`
        )
    }

    public getNumberOfRevisionsPerFeature(): Promise<any> {
        return axios.get(
            `${CommunicationService.BASE_URI + CommunicationService.FEATURE_ENDPOINT + CommunicationService.NUMBER_OF_REVISIONS_PER_FEATURE_IN_FEATURE_ENDPOINT}`
        )
    }

    public getNumberOfArtifactsPerDepth(): Promise<any> {
        return axios.get(
            `${CommunicationService.BASE_URI + CommunicationService.ASSOCIATIONS_ENDPOINT + CommunicationService.NUMBER_OF_ARTIFACTS_PER_DEPTH_IN_ASSOCIATION_ENDPOINT}`
        )
    }

    public getNumberOfArtifactsPerAssociation(): Promise<any> {
        return axios.get(
            `${CommunicationService.BASE_URI + CommunicationService.ASSOCIATIONS_ENDPOINT + CommunicationService.NUMBER_OF_ARTIFACTS_PER_ASSOCIATION_IN_ASSOCIATION_ENDPOINT}`
        )
    }

    public static getInstance() {
        if (!this.communicationServiceInstance) {
            this.communicationServiceInstance = new CommunicationService();
        }
        return this.communicationServiceInstance;
    }

    public getAssociations(): Promise<any> {
        return axios.get(
            `${CommunicationService.BASE_URI + CommunicationService.ASSOCIATIONS_ENDPOINT}`,
        )
    }

    public getFeatureversionsFromFeature(currentFeatureModel: FeatureModel): Promise<any> {
        let config = new RequestConfig();
        config.headers = {
            'Content-Type': 'application/json',
        };
        return axios.get(
            `${CommunicationService.BASE_URI + CommunicationService.FEATURE_ENDPOINT}/${currentFeatureModel.name}/version`,
            config
        )
    }

    public updateFeatureInBackend(updatedFeatureModel: FeatureModel): Promise<any> {
        let config = new RequestConfig();
        config.headers = {
            'Content-Type': 'application/json',
        };
        return axios.post(
            `${CommunicationService.BASE_URI + CommunicationService.FEATURE_ENDPOINT}`,
            JSON.stringify(updatedFeatureModel),
            config
        )
    }

    public getFeatures(): Promise<any> {
        return axios.get(
            `${CommunicationService.BASE_URI + CommunicationService.FEATURE_ENDPOINT}`
        );
    }

    /*     public doOpenCloseRepositoryWithDirectory(baseDirectory: string, openCloseRepositoryOperation: string) : Promise<any> {
            let config = new RequestConfig();
            config.headers = {
                'Content-Type': 'application/json',
            };
            let operationContainer = new OperationContainer();
            operationContainer.repositoryOperation = openCloseRepositoryOperation;
            operationContainer.baseDirectory = baseDirectory;
            return axios.post(
                `${CommunicationService.BASE_URI + CommunicationService.REPOSITORY_ENDPOINT}`,
                JSON.stringify(operationContainer),
                config
            );
        }
     */
    /*     public getArtifactsByAssociation(association: AssociationModel[]) : Promise<any> {
            let config = new RequestConfig();
            config.headers = {
                'Content-Type': 'application/json',
            };
            return axios.post(
                `${CommunicationService.BASE_URI + CommunicationService.ARTIFACT_ENDPOINT}`,
                JSON.stringify(association),
                config
            )
        } */

    public corsTest(): Promise<any> {
        let config = new RequestConfig();
        config.headers = {
            'Content-Type': 'application/json',
            'crossdomain': true
        };

        return axios.post(
            `${CommunicationService.BASE_URI + CommunicationService.REPOSITORY_ENDPOINT}/corstest`,
            config
        )
    }

    public closeRepositoryWithDirectory(): Promise<any> {
        return axios.get(
            `${CommunicationService.BASE_URI + CommunicationService.REPOSITORY_ENDPOINT}`
        );
    }
}
