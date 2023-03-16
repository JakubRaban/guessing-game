import React, {FunctionComponent} from "react";

import './HowToPlay.scss'

export const HowToPlay: FunctionComponent = () => {
  return (
    <section className="how-to-play">
      <h2 className="header">HOW TO PLAY</h2>
      <ol>
        <li>Create a game and invite your friends using a provided link</li>
        <li>
          After the game starts, everyone gets to pick some real or fictional character for the indicated player.
        </li>
        <li>In turns, you try to guess your character by asking questions. Other players must reply to them 'Yes' or 'No'</li>
        <li>Feeling confident? You can make a guess and you win the game if you're correct!</li>
      </ol>
    </section>
  )
}
