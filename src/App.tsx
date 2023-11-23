import React from 'react';
import { BrowserRouter } from "react-router-dom";
import { SharedStateProvider } from "./states/AppState";
import { AppRouter } from "./AppRouter";

import './App.scss';

export default class App extends React.Component {
  render() {
    return (
      <SharedStateProvider>
        <BrowserRouter basename={process.env.PUBLIC_URL}>
          <AppRouter />
        </BrowserRouter>
      </SharedStateProvider>
    );
  }
}