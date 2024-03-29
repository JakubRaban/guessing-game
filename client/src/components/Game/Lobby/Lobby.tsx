import React, {FunctionComponent, useEffect, useState} from "react";
import {Game, Player} from '../../../types/game'
import {SERVER_SENT_EVENTS, CLIENT_SENT_EVENTS} from "../../../events/socket-event-types";
import {PlayerNameForm} from "./PlayerNameForm/PlayerNameForm";
import {LobbyPlayersList} from "./PlayersList/LobbyPlayersList";
import {useSocket} from "../../../hooks/useSocket";

export const Lobby: FunctionComponent<{ game: Game }> = ({ game }) => {
  const { socket } = useSocket()
  const [players, setPlayers] = useState<Player[] | null>(null)
  const currentPlayer = players?.find(player => player.socketId === socket.id)!
  const allPlayersHaveChosenName = players?.every((player) => !!player.name)
  const [gameJoiningError, setGameJoiningError] = useState<string | null>(null)

  useEffect(() => {
    socket.on(SERVER_SENT_EVENTS.PLAYER_LIST_UPDATED, setPlayers)
    socket.on(SERVER_SENT_EVENTS.ERROR_JOINING_GAME, ({ error }) => setGameJoiningError(error))

    socket.emit(CLIENT_SENT_EVENTS.JOIN_GAME, { gameId: game.urlId })
  }, [])

  const handleNameConfirmed = (name: string) => {
    socket.emit(CLIENT_SENT_EVENTS.SET_NAME, { name })
  }

  const handleStartGame = () => {
    socket.emit(CLIENT_SENT_EVENTS.START_GAME)
  }

  if (gameJoiningError) {
    return <p>Could not join this game: {gameJoiningError}</p>
  }

  if (players === null || currentPlayer.name === null) {
    return <PlayerNameForm onConfirm={handleNameConfirmed} />
  }

  return (
    <>
      <p>Invite your friends to the game by sending them this link: {window.location.href}</p>
      <LobbyPlayersList
        players={players}
        currentPlayer={currentPlayer}
        limit={game.GameOption.maxPlayers}
      />
      <button
        disabled={!allPlayersHaveChosenName || players.length < 2}
        onClick={handleStartGame}
      >
        Start the game
      </button>
      {!allPlayersHaveChosenName && <p>Let's wait for all players to choose their name</p>}
      {players.length < 2 && <p>Invite your friends to start the game</p>}
    </>
  )
}
