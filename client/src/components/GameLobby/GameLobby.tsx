import React, {FunctionComponent, useContext, useEffect, useState} from "react";
import {Game, Player} from '../../types/Game'
import {SocketIOContext} from "../../contexts/SocketIOContext";
import {SERVER_SENT_EVENTS, CLIENT_SENT_EVENTS} from "../../events/event-types";
import {PlayerNameForm} from "../PlayerNameForm/PlayerNameForm";
import {PlayersList} from "../PlayersList/PlayersList";

export const GameLobby: FunctionComponent<{ game: Game }> = ({ game }) => {
  const { socket } = useContext(SocketIOContext)
  const [players, setPlayers] = useState<Player[] | null>(null)
  const currentPlayer = players?.find((player) => player.socketId === socket.id)
  const [gameJoiningError, setGameJoiningError] = useState<string | null>(null)

  useEffect(() => {
    socket.connect()
    return () => {
      socket.disconnect()
    }
  }, [])

  useEffect(() => {
    socket.on(SERVER_SENT_EVENTS.PLAYER_LIST_UPDATED, setPlayers)
    socket.on(SERVER_SENT_EVENTS.ERROR_JOINING_GAME, ({ error }) => setGameJoiningError(error))

    socket.emit(CLIENT_SENT_EVENTS.JOIN_GAME, { gameId: game.urlId })
  }, [])

  const handleNameConfirmed = (name: string) => {
    socket.emit(CLIENT_SENT_EVENTS.SET_NAME, { name })
  }

  if (gameJoiningError) {
    return <p>Could not join this game: {gameJoiningError}</p>
  }

  if (players === null || currentPlayer!.name === null) {
    return <PlayerNameForm onConfirm={handleNameConfirmed} />
  }

  return (
    <>
      <p>Invite your friends to the game by sending them this link: {window.location.href}</p>
      <PlayersList players={players} limit={game.GameOption.maxPlayers} />
    </>
  )
}
