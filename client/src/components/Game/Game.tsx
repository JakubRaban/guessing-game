import React, {FunctionComponent, useEffect, useState} from "react";
import { Game as GameType } from "../../types/game";
import {Lobby} from "./Lobby/Lobby";
import {SERVER_SENT_EVENTS} from "../../events/socket-event-types";
import {Gameplay} from "./Gameplay/Gameplay";
import {useSocket} from "../../hooks/useSocket";
import {GameSummary} from "./GameSummary/GameSummary";

export const Game: FunctionComponent<{ game: GameType }> = ({ game: fetchedGame }) => {
  const { socket } = useSocket()
  const [game, setGame] = useState(fetchedGame)

  useEffect(() => {
    socket.connect()
    return () => {
      socket.disconnect()
    }
  }, [])

  useEffect(() => {
    socket.on(SERVER_SENT_EVENTS.GAME_STARTED, () => {
      setGame((game) => ({ ...game, status: 'playing' }))
    })
    socket.on(SERVER_SENT_EVENTS.GAME_COMPLETED, () => {
      setGame((game) => ({ ...game, status: 'finished' }))
    })
  }, [])

  switch (game.status) {
    case 'lobby':
      return <Lobby game={game} />
    case 'playing':
      return <Gameplay />
    case 'finished':
      return <GameSummary />
  }
}
