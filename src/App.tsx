import React from 'react';
import { SharedStateProvider } from "./states/AppState";
import { AppRouter } from "./AppRouter";

import './App.scss';

export default class App extends React.Component {
  render() {
    return (
      <SharedStateProvider>
        <AppRouter />
      </SharedStateProvider>
    );
  }
}