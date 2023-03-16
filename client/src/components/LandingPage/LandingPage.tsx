import React, {FunctionComponent} from 'react';

import {HowToPlay} from "./HowToPlay/HowToPlay";
import {MainMenu} from "./MainMenu/MainMenu";

import './LandingPage.scss';
import {Header} from "../lib/Header/Header";

export const LandingPage: FunctionComponent = () => (
  <div className="landing-page">
    <section className="main-section">
      <Header>Guessing Game</Header>
      <MainMenu />
    </section>
    <HowToPlay />
  </div>
)
