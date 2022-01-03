import React, {FunctionComponent, useContext, useEffect, useReducer} from "react";
import {GameState, GameStateEvent} from "../../../types/game-state";
import {SocketIOContext} from "../../../contexts/SocketIOContext";
import {CLIENT_SENT_EVENTS, SERVER_SENT_EVENTS} from "../../../events/socket-event-types";
import {MainScreen} from "../MainScreen/MainScreen";
import {CharacterAssignment} from "../CharacterAssignment/CharacterAssignment";

const initialGameState: GameState = {
  players: [],
  currentPlayerIndex: 0,
  currentTurnText: undefined,
  currentTurnType: undefined,
}

const gameStateReducer = (state: GameState, event: GameStateEvent): GameState => {
  switch (event.type) {
    case 'gameStartPlayersOrdered':
      return { ...state, players: event.payload.players }
    case 'questionAsked':
      return { ...state, currentTurnText: event.payload.text, currentTurnType: 'question' }
    case 'answerGiven':
      return { ...state, currentTurnText: event.payload.text, currentTurnType: 'answer' }
    case 'voteReceived':
      return {
        ...state,
        players: state.players.map((player) =>
          player.socketId === event.payload.playerId ? { ...player, lastVote: event.payload.vote } : player)
      }
    case 'puzzleAssigned':
      return {
        ...state,
        players: state.players.map((player) =>
          player.socketId === event.payload.socketId ? { ...player, ...event.payload }: player)
      }
    case 'puzzleSelfAssigned':
      return {
        ...state,
        players: state.players.map((player) =>
          player.socketId === event.payload.socketId
            ? { ...player, assignedPuzzle: '_', puzzleInfoPage: '_' }
            : player
        )
      }
  }
}

export const Gameplay: FunctionComponent = () => {
  const { socket } = useContext(SocketIOContext)
  const [gameState, modifyGameState] = useReducer(gameStateReducer, initialGameState)

  useEffect(() => {
    socket.on(SERVER_SENT_EVENTS.GAME_START_PLAYERS_ORDERED, (players) => {
      modifyGameState({ type: 'gameStartPlayersOrdered', payload: { players }})
    })
    socket.on(SERVER_SENT_EVENTS.PUZZLE_ASSIGNED, (payload) => {
      console.log(payload)
      modifyGameState({ type: 'puzzleAssigned', payload })
    })
    socket.on(SERVER_SENT_EVENTS.PUZZLE_SELF_ASSIGNED, () => {
      modifyGameState({ type: 'puzzleSelfAssigned', payload: { socketId: socket.id } })
    })

    socket.emit(CLIENT_SENT_EVENTS.GAME_START_GET_ORDERED_PLAYERS)
  }, [])

  if (gameState.players.length === 0) {
    return <p>Loading game...</p>
  }

  return gameState.players.every((player) => player.assignedPuzzle) ? (
    <MainScreen gameState={gameState} />
  ) : (
    <CharacterAssignment players={gameState.players} />
  )
}
