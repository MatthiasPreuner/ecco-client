import { useState } from "react";
import { createContainer } from "react-tracked";

import { RepositoryHeaderModel, RepositoryModel } from "../model/RepositoryModel";

export interface AppState {
  repository: RepositoryModel,
  availableRepositories: RepositoryHeaderModel[],
  loggedUserName: string,
  loginToken: any
}

const useValue = () => useState<AppState>({
  repository: null,
  availableRepositories: null,
  loggedUserName: null,
  loginToken: false
});

export const {
  Provider: SharedStateProvider,
  useTracked: useSharedState
} = createContainer(useValue);
