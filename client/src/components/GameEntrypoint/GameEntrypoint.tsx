import React, {FunctionComponent, useEffect, useState} from "react";
import {useLocation, useParams} from "react-router";
import {Game as GameType} from "../../types/Game";
import {fetchJson} from "../../helpers";
import {GameLobby} from "../GameLobby/GameLobby";

export const GameEntrypoint: FunctionComponent = () => {
  const { gameId } = useParams()
  const [game, setGame] = useState<GameType | null>(null)
  const location = useLocation()

  useEffect(() => {
    // @ts-ignore
    const passedNewGame = location.state?.game as GameType
    if (passedNewGame) {
      // Game was passed from the "NewGame" component
      setGame(passedNewGame)
    } else {
      fetchJson(`http://localhost:9000/games/${gameId}`).then((res) => {
        setGame(res)
      })
    }
  }, [])

  if (game === null) {
    return <p>Loading game...</p>
  }

  if (game.status === 'playing') {
    return <p>This game is already in progress</p>
  }

  if (game.status === 'finished') {
    return <p>This game has already been finished</p>
  }

  return (
    <GameLobby game={game} />
  )
}
