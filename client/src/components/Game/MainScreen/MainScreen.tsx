import React, {FunctionComponent} from "react";
import {GameState} from "../../../types/game-state";

export const MainScreen: FunctionComponent<{ gameState: GameState }> = ({ gameState }) => {
  return <p>Game main screen</p>
}
