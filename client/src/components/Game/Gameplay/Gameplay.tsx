import React, {FunctionComponent, useEffect, useReducer} from "react";
import {CLIENT_SENT_EVENTS, SERVER_SENT_EVENTS} from "../../../events/socket-event-types";
import {GameMainScreen} from "../MainScreen/GameMainScreen";
import {CharacterAssignment} from "../CharacterAssignment/CharacterAssignment";
import {useSocket} from "../../../hooks/useSocket";
import {gameStateReducer, initialGameState} from "../../../game-state";
import {GameStateContext} from "../../../contexts/GameStateContext";
import {PuzzledPlayer} from "../../../types/game";

export const Gameplay: FunctionComponent = () => {
  const { socket } = useSocket()
  const [gameState, modifyGameState] = useReducer(gameStateReducer, initialGameState)

  useEffect(() => {
    socket.on(SERVER_SENT_EVENTS.PUZZLE_ASSIGNED, (payload) => {
      modifyGameState({ type: 'puzzleAssigned', payload })
    })
    socket.on(SERVER_SENT_EVENTS.PUZZLE_SELF_ASSIGNED, () => {
      modifyGameState({ type: 'puzzleSelfAssigned', payload: { socketId: socket.id } })
    })
    socket.on(SERVER_SENT_EVENTS.TURN_TAKEN, (payload) => {
      modifyGameState({ type: 'turnTakenEvent', payload })
    })
    socket.on(SERVER_SENT_EVENTS.VOTE_CAST, (payload) => {
      modifyGameState({ type: 'voteCast', payload })
    })
    socket.on(SERVER_SENT_EVENTS.VOTING_COMPLETED, (payload) => {
      modifyGameState({ type: 'votingCompleted', payload })
    })
    socket.on(SERVER_SENT_EVENTS.TENTATIVE_VOTE_RESULT_DETERMINED, (payload) => {
      modifyGameState({ type: 'votingCompleted', payload }) // deliberately reusing same event type
    })

    socket.emit(CLIENT_SENT_EVENTS.GAME_START_GET_ORDERED_PLAYERS, (players: PuzzledPlayer[]) => {
      modifyGameState({ type: 'gameStartPlayersOrdered', payload: { players } })
    })
  }, [])

  if (gameState.players.length === 0) {
    return <p>Loading game...</p>
  }

  return (
    <GameStateContext.Provider value={{ gameState }}>
      {gameState.players.every((player) => player.assignedPuzzle) ? (
        <GameMainScreen />
      ) : (
        <CharacterAssignment />
      )}
    </GameStateContext.Provider>
  )
}
