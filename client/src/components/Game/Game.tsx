import React, {FunctionComponent, useContext, useEffect, useState} from "react";
import { Game as GameType } from "../../types/game";
import {SocketIOContext} from "../../contexts/SocketIOContext";
import {Lobby} from "./Lobby/Lobby";
import {SERVER_SENT_EVENTS} from "../../events/socket-event-types";
import {Gameplay} from "./Gameplay/Gameplay";

export const Game: FunctionComponent<{ game: GameType }> = ({ game: fetchedGame }) => {
  const { socket } = useContext(SocketIOContext)
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
  }, [])

  switch (game.status) {
    case 'lobby':
      return <Lobby game={game} />
    case 'playing':
      return <Gameplay />
    case 'finished':
      return <p>Game finished</p>
  }
}
