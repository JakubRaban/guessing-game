import React, {FunctionComponent} from 'react';

import {HowToPlay} from "./HowToPlay/HowToPlay";
import {MainMenu} from "./MainMenu/MainMenu";

import './LandingPage.scss';

export const LandingPage: FunctionComponent = () => (
  <div className="landing-page">
    <section className="main-section">
      <h1 className="landing-page-title">
        Guessing Game
      </h1>
      <MainMenu />
    </section>
    <HowToPlay />
  </div>
)
