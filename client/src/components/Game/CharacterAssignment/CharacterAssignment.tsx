import React, {FunctionComponent} from "react";
import {PuzzledPlayer} from "../../../types/game";

export const CharacterAssignment: FunctionComponent<{ players: PuzzledPlayer[] }> = ({ players }) => {
  return <>
    {players.map((player) => <p>{player.name}</p>)}
  </>
}
