import React, {FunctionComponent} from "react";
import {Player} from "../../types/Game";

export const PlayersList: FunctionComponent<{ players: Player[], limit: number }> = ({
  players,
  limit
}) => (
  <div>
    Players in the game:
    <ol>
      {players.map((player) => <li>{player.name || '(joining)'}</li>)}
    </ol>
    {players.length}/{limit}
  </div>
)
