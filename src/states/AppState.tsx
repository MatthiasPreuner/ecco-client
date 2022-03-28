import { useState } from "react";
import { createContainer } from "react-tracked";

/* import { ReducedArtifactPlugin } from "../Domain/Model/Backend/ReducedArtifactPlugin";
import { ArtefactTreeModel } from "../Domain/Model/Backend/ArtefactTreeModel"; */
import { RepositoryHeaderModel, RepositoryModel } from "../model/RepositoryModel";

export interface AppState {
  repository: RepositoryModel,
  availableRepositories: RepositoryHeaderModel[],
  /*     plugins: ReducedArtifactPlugin[] */
  /*   artifactTree: ArtefactTreeModel, */
  /*   associations: AssociationInspection[], */
  eccoServiceIsInitialized: boolean,
  userIsLoggedIn: boolean
}

const useValue = () => useState<AppState>({
  repository: null,
  availableRepositories: [],
  /*   artifactTree: null, */
  /*    plugins: [], */
  eccoServiceIsInitialized: true,
  userIsLoggedIn: false
});

export const {
  Provider: SharedStateProvider,
  useTracked: useSharedState
} = createContainer(useValue);
