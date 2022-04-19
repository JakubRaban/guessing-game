import {TurnType} from "./game-state";

export type GameStatus = 'lobby' | 'playing' | 'finished'

export interface GameOptions {
  maxPlayers: number
}

export interface Game {
  id: number
  urlId: string
  status: GameStatus
  GameOption: GameOptions
}

export interface Player {
  id: number
  name?: string
  socketId: string
  standings: number
}

export interface PuzzleData {
  assignedPuzzle: string
  puzzleInfoPage: string
}

export type PuzzledPlayer = Player & Partial<PuzzleData> & {
  lastVote?: Vote
}

export type YesNoVote = 'yes' | 'no'
export type Vote = YesNoVote | '?' | 'discuss'

export type VotesCount = {
  [vote in Vote]: number
}

export interface TurnData {
  turnType: TurnType
  text: string
}
