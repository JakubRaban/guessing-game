import React, {FunctionComponent} from 'react';
import logo from './logo.svg';
import './App.css';
import {Link} from "react-router-dom";

export const App: FunctionComponent = () =>
  <div className="App">
    <header className="App-header">
      <img src={logo} className="App-logo" alt="logo" />
      <p>
        Edit <code>src/App.tsx</code> and save to reload.
      </p>
      <Link to="/new-game" >
        Learn React
      </Link>
    </header>
  </div>
