import React, {FunctionComponent} from "react";
import {Player} from "../../../../types/game";

export const PlayersList: FunctionComponent<{
  players: Player[],
  limit: number,
  currentPlayer?: Player
}> = ({ players, limit, currentPlayer }) => (
  <div>
    Players in the game:
    <ol>
      {players.map((player) => (
        <li key={player.id}>{player.name || '(joining)'}{player === currentPlayer ? ' (you)' : ''}</li>
      ))}
    </ol>
    {players.length}/{limit}
  </div>
)
