import {GameState, GameStateEvent} from "./types/game-state";

export const initialGameState: GameState = {
  players: [],
  currentTurnPlayerIndex: 0,
  currentTurnText: undefined,
  currentTurnType: undefined,
  votingResult: undefined,
}

export const gameStateReducer = (state: GameState, event: GameStateEvent): GameState => {
  switch (event.type) {
    case 'gameStartPlayersOrdered':
      return { ...state, players: event.payload.players }
    case 'questionAsked':
      return { ...state, currentTurnText: event.payload.text, currentTurnType: 'question' }
    case 'answerGiven':
      return { ...state, currentTurnText: event.payload.text, currentTurnType: 'answer' }
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
    case 'turnTakenEvent':
      return { ...state, currentTurnType: event.payload.turnType, currentTurnText: event.payload.text }
    case 'voteCast':
      return {
        ...state,
        players: state.players.map((player) =>
          player.socketId === event.payload.playerId ? { ...player, lastVote: event.payload.vote } : player)
      }
    case 'votingCompleted':
      return {
        ...state,
        votingResult: event.payload.votingResult,
      }
    case 'newTurnStarted':
      return {
        ...initialGameState,
        players: state.players.map((player) => ({ ...player, lastVote: undefined })),
        currentTurnPlayerIndex: (state.currentTurnPlayerIndex + 1) % state.players.length,
      }
  }
}
