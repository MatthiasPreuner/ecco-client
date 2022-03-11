import * as React from "react";
import { useState, useReducer } from "react";
import { createContainer } from "react-tracked";

import { FeatureModel, FeatureModelDefault } from "../model/FeatureModel";
/* import { ReducedArtifactPlugin } from "../Domain/Model/Backend/ReducedArtifactPlugin";
import { AssociationInspection } from "../Domain/Model/Frontend/AssociationInspection";
import { ArtefactTreeModel } from "../Domain/Model/Backend/ArtefactTreeModel"; */
import { CommitModel } from "../model/CommitModel";
import { RepositoryModel } from "../model/RepositoryModel";

export interface AppState {
  repository: RepositoryModel,
  availableRepositories: string[],
  repoOperation: string,
  commits: CommitModel[],
  /*     plugins: ReducedArtifactPlugin[] */
  /*   artifactTree: ArtefactTreeModel, */
  /*   associations: AssociationInspection[], */
  eccoServiceIsInitialized: boolean,
  currentFeature: FeatureModel,
  userIsLoggedIn: boolean
}

const useValue = () => useState<AppState>({
  repository: null,
  availableRepositories: ["test1", "test2"],
  repoOperation: "",
  commits: null,
  /*   artifactTree: null, */
  /*    associations: [], */
  /*    plugins: [], */
  eccoServiceIsInitialized: true,
  currentFeature: {
    id: null,
    description: null,
    name: null,
    revisions: []
  },
  userIsLoggedIn: false
});

export const {
  Provider: SharedStateProvider,
  useTracked: useSharedState
} = createContainer(useValue);
