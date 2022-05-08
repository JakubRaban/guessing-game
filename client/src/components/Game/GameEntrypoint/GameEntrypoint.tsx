import React, {FunctionComponent, useEffect, useState} from "react";
import {useLocation, useParams} from "react-router";
import {Game as GameType} from "../../../types/game";
import {fetchJson} from "../../../helpers";
import {Game} from "../Game";

export const GameEntrypoint: FunctionComponent = () => {
  const { gameId } = useParams()
  const [game, setGame] = useState<GameType | null>(null)
  const location = useLocation()

  useEffect(() => {
    const passedNewGame = (location.state as { game?: GameType })?.game
    if (passedNewGame) {
      // Game was passed from the "NewGame" component
      setGame(passedNewGame)
    } else {
      fetchJson(`/api/games/${gameId}`).then((res) => {
        setGame(res)
      })
    }
  }, [])

  if (game === null) {
    return <p>Loading game...</p>
  }

  switch (game.status) {
    case "lobby":
      return <Game game={game} />
    case "playing":
      return <p>This game is already in progress</p>
    case "finished":
      return <p>This game has already been finished</p>
  }
}
