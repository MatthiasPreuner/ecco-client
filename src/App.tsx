import React from 'react';
import { SharedStateProvider } from "./states/AppState";
import { AppRouter } from "./AppRouter";

import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
/* 
const App = () => (
  <SharedStateProvider>
    <AppRouter />
  </SharedStateProvider>
);
 */
export default class App extends React.Component {
  render() {
    return (
      <SharedStateProvider>
        <AppRouter />
      </SharedStateProvider>
    );
  }
}

/* export default App;
 */