import {Player, PuzzledPlayer, Vote} from "./game";

export type TurnType = 'question' | 'answer'

export interface GameState {
  players: PuzzledPlayer[]
  currentPlayerIndex: number
  currentTurnText?: string
  currentTurnType?: TurnType
}

export interface GameStartPlayersOrderedEvent {
  type: 'gameStartPlayersOrdered'
  payload: {
    players: Player[]
  }
}

export interface QuestionAskedEvent {
  type: 'questionAsked'
  payload: {
    text: string
  }
}

export interface AnswerGivenEvent {
  type: 'answerGiven'
  payload: {
    text: string
  }
}

export interface VoteReceivedEvent {
  type: 'voteReceived'
  payload: {
    playerId: string
    vote: Vote
  }
}

export interface PuzzleAssigned {
  type: 'puzzleAssigned',
  payload: {
    socketId: string
    assignedPuzzle: string
    puzzleInfoPage: string
  }
}

export interface PuzzleSelfAssigned {
  type: 'puzzleSelfAssigned',
  payload: {
    socketId: string
  }
}

export type GameStateEvent =
  GameStartPlayersOrderedEvent
  | QuestionAskedEvent
  | AnswerGivenEvent
  | VoteReceivedEvent
  | PuzzleAssigned
  | PuzzleSelfAssigned
