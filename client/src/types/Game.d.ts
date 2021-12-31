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
  name?: string
  socketId?: string
}
