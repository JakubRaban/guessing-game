import {Player, PuzzleData, PuzzledPlayer, Vote} from "./game";

export type TurnType = 'question' | 'answer'

export interface GameState {
  players: PuzzledPlayer[]
  currentTurnPlayerIndex: number
  currentTurnText?: string
  currentTurnType?: TurnType
  votingResult?: Vote
  immediatelyGuessed?: boolean
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

export interface TurnTakenEvent {
  type: 'turnTaken',
  payload: {
    turnType: TurnType
    text: string
    guessed: boolean
  }
}

export interface VoteCastEvent {
  type: 'voteCast'
  payload: {
    playerId: string
    vote: Vote
  }
}

export interface VotingCompletedEvent {
  type: 'votingCompleted'
  payload: {
    votingResult: Vote
    immediate?: boolean
  }
}

export interface PuzzleSolved {
  type: 'puzzleSolved'
  payload: {
    puzzleData: PuzzleData
    standings: number
    playerId: string
  }
}

export interface TurnCompletedEvent {
  type: 'turnCompleted'
}

export interface NewTurnStartedEvent {
  type: 'newTurnStarted'
}

export type GameStateEvent =
  GameStartPlayersOrderedEvent
  | QuestionAskedEvent
  | AnswerGivenEvent
  | VoteCastEvent
  | PuzzleAssigned
  | PuzzleSelfAssigned
  | TurnTakenEvent
  | VotingCompletedEvent
  | NewTurnStartedEvent
  | PuzzleSolved
