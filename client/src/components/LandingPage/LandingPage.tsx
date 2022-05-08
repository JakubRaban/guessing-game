import React, {FunctionComponent} from 'react';
import {Link} from "react-router-dom";

import './LandingPage.css';

export const LandingPage: FunctionComponent = () => (
  <div className="App">
    <header className="App-header">
      <Link to="/new-game">
        Start new game
      </Link>
    </header>
  </div>
)
