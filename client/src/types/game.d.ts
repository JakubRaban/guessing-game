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
}

export type Vote = 'yes' | 'no' | '?' | 'discuss'

export type PuzzledPlayer = Player & {
  assignedPuzzle?: string
  puzzleInfoPage?: string
  lastVote?: Vote
}
