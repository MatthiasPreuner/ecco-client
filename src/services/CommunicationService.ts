/* import { OperationContainer } from "../Domain/Model/Frontend/OperationContainer";  */
import { RequestConfig } from "../model/RequestConfig";
import { FeatureModel } from "../model/FeatureModel";
import { FeatureRevisionModel } from "../model/FeatureRevisionModel";
import { VariantModel } from "../model/VariantModel";
/* import {AssociationModel} from "../Domain/Model/Backend/AssociationModel";
import {AssociationInspection} from "../Domain/Model/Frontend/AssociationInspection";
import {ArtefactgraphFilter} from "../Domain/Model/Backend/ChartArtefactgraph/ArtefactgraphFilter"; */

const axios = require("axios");

export class CommunicationService {

    private static readonly BASE_URI = "http://localhost:8080/api";
    private static readonly FEATURE_ENDPOINT = "/features";
    private static readonly VARIANT_ENDPOINT = "/variants";
    private static readonly ARTIFACT_ENDPOINT = "/artefacts";
    private static readonly ARTIFACT_GRAPH_ENDPOINT = "/graph";
    private static readonly ARTIFACT_UPDATED_GRAPH_ENDPOINT = "/updatedgraph";
    private static readonly REPOSITORY_ENDPOINT = "/repository";
    private static readonly ASSOCIATIONS_ENDPOINT = "/associations";
    private static readonly COMMIT_FILES_INSIDE_ZIP_FILE = "/commit";
    private static readonly NUMBER_OF_ARTIFACTS_PER_ASSOCIATION_IN_ASSOCIATION_ENDPOINT = "/numberofartifacts";
    private static readonly NUMBER_OF_ARTIFACTS_PER_DEPTH_IN_ASSOCIATION_ENDPOINT = "/artifactsperdepth";
    private static readonly NUMBER_OF_REVISIONS_PER_FEATURE_IN_FEATURE_ENDPOINT = "/numberofrevisions";
    private static readonly NUMBER_OF_MODULES_PER_ORDER_IN_ASSOCIATION_ENDPOINT = "/modulesperorder";

    private static communicationServiceInstance: CommunicationService;

    private constructor() {

    }

    public getDefaultRepo(): Promise<any> {
        let config = new RequestConfig();
        config.headers = {
            'Access-Control-Allow-Credentials': true,
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
            /*  'Content-Type': 'multipart/form-data' */
        }
        const instance = axios.create({
            headers: config.headers
        })
        /* axios.post() */
        return axios.post(
            `${CommunicationService.BASE_URI + CommunicationService.REPOSITORY_ENDPOINT + '/initBig'}`, 'Access-Control-Allow-Origin'
        )
    }

    // VARIANTS
    public createVariant(name: string, config: string): Promise<any> { // TODO config
        return axios.put(
            `${CommunicationService.BASE_URI + CommunicationService.VARIANT_ENDPOINT}/${name}`,
        )
    }

    public deleteVariant(variant: VariantModel): Promise<any> {
        return axios.delete(
            `${CommunicationService.BASE_URI + CommunicationService.VARIANT_ENDPOINT}/${variant.name}`,
        )
    }

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
            `${CommunicationService.BASE_URI + CommunicationService.REPOSITORY_ENDPOINT + CommunicationService.COMMIT_FILES_INSIDE_ZIP_FILE}`,
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

    public updateFeatureversionFromFeature(currentFeatureModel: FeatureModel, updatedFeatureVersionModel: FeatureRevisionModel): Promise<any> {
        let config = new RequestConfig();
        config.headers = {
            'Content-Type': 'application/json',
        };
        return axios.post(
            `${CommunicationService.BASE_URI + CommunicationService.FEATURE_ENDPOINT}/${currentFeatureModel.name}/version`,
            JSON.stringify(updatedFeatureVersionModel),
            config
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
