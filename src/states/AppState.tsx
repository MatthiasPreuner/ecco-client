import * as React from "react";
import { useState, useReducer } from "react";
import { createContainer } from "react-tracked";

import { FeatureModel, FeatureModelDefault } from "../model/FeatureModel";
/* import { ReducedArtifactPlugin } from "../Domain/Model/Backend/ReducedArtifactPlugin";
import { AssociationInspection } from "../Domain/Model/Frontend/AssociationInspection";
import { ArtefactTreeModel } from "../Domain/Model/Backend/ArtefactTreeModel"; */
import { CommitModel, CommitModelDefault } from "../model/CommitModel";

export interface AppState {
  directory: string, // TODO nullable, rename to repository
  repository: string,
  availableRepositories: string[],
  repoOperation: string,
  commits: CommitModel[],
  /*     plugins: ReducedArtifactPlugin[] */
  /*   artifactTree: ArtefactTreeModel, */
  features: FeatureModel[],
  /*   associations: AssociationInspection[], */
  eccoServiceIsInitialized: boolean,
  currentFeature: FeatureModel,
  userIsLoggedIn: boolean
}

const useValue = () => useState<AppState>({
  directory: "",
  repository: "null",
  availableRepositories: ["test1", "test2"],
  repoOperation: "",
  commits: CommitModelDefault,
  /*   artifactTree: null, */
  features: FeatureModelDefault.concat([...FeatureModelDefault]).concat([...FeatureModelDefault]).concat([...FeatureModelDefault]),
  /*    associations: [], */
  /*    plugins: [], */
  eccoServiceIsInitialized: true,
  currentFeature: {
    id: null,
    description: null,
    name: null
  },
  userIsLoggedIn: false
});

export const {
  Provider: SharedStateProvider,
  useTracked: useSharedState
} = createContainer(useValue);
