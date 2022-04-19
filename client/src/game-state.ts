import {GameState, GameStateEvent} from "./types/game-state";

export const initialGameState: GameState = {
  players: [],
  currentTurnPlayerIndex: 0,
  currentTurnText: undefined,
  currentTurnType: undefined,
  votingResult: undefined,
  immediatelyGuessed: undefined
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
    case 'turnTaken':
      return {
        ...state,
        currentTurnType: event.payload.turnType,
        currentTurnText: event.payload.text,
      }
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
        immediatelyGuessed: !!event.payload.immediate,
      }
    case 'puzzleSolved':
      return {
        ...state,
        players: state.players.map((player) =>
          event.payload.playerId === player.socketId
            ? { ...player, standings: event.payload.standings, ...event.payload.puzzleData }
            : { ...player }
        )
      }
    case 'newTurnStarted':
      let nextPlayerIndex = state.currentTurnPlayerIndex;
      do {
        nextPlayerIndex = (nextPlayerIndex + 1) % state.players.length;
      } while (state.players[nextPlayerIndex].standings !== 0)

      return {
        ...initialGameState,
        players: state.players.map((player) => ({ ...player, lastVote: undefined })),
        currentTurnPlayerIndex: nextPlayerIndex,
      }
  }
}
