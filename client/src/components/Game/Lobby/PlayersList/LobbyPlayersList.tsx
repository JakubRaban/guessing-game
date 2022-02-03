import React, {FunctionComponent} from "react";
import {Player} from "../../../../types/game";

export const LobbyPlayersList: FunctionComponent<{
  players: Player[],
  currentPlayer: Player,
  limit: number
}> = ({ players, currentPlayer, limit }) => (
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
