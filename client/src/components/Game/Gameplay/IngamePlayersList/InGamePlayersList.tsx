import React, {FunctionComponent} from "react";
import cx from "classnames";
import {getAssignedPuzzleWithLinkToInfoPage} from "../../../../helpers";
import {usePlayer, usePlayers, useTurn} from "../../../../hooks/game-state";

export const InGamePlayersList: FunctionComponent = () => {
  const players = usePlayers()
  const localPlayer = usePlayer()
  const { activePlayer } = useTurn()

  return (
    <ul>
      {players.map((player) => (
        <li
          key={player.id}
          className={cx({ playing: player === activePlayer })}
        >
          {player.name} {player === localPlayer ? <>(you)</> : <>as {getAssignedPuzzleWithLinkToInfoPage(player)}</>}
        </li>
      ))}
    </ul>
  )
}
