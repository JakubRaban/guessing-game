import React, {FunctionComponent} from "react";
import {Player} from "../../../../types/game";
import {useCurrentPlayer} from "../../../../hooks/use-current-player";

export const PlayersList: FunctionComponent<{
  players: Player[],
  limit: number,
}> = ({ players, limit }) => {
  const currentPlayer = useCurrentPlayer(players)

  return (
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
}
