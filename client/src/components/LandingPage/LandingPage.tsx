import React, {FunctionComponent} from 'react';
import logo from './logo.svg';
import './LandingPage.css';
import {Link} from "react-router-dom";

export const LandingPage: FunctionComponent = () => (
  <div className="App">
    <header className="App-header">
      <img src={logo} className="App-logo" alt="logo" />
      <p>
        Edit <code>src/LandingPage.tsx</code> and save to reload.
      </p>
      <Link to="/new-game">
        Start new game
      </Link>
    </header>
  </div>
)
