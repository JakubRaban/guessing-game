import { findGameById, findGameByIdWithTurnsData, updateGameStatus } from '../repositories/game'
import { createPlayer, findAllPlayersInGame, updateOrderOfPlaying } from '../repositories/player'
import { shuffleArray } from '../helpers/algorithms'

export const joinGame = async (gameId: string, socketId: string) => {
  const game = (await findGameById(gameId)) as any
  const { Players: players, GameOption: options } = game

  if (players.length === options.maxPlayers) {
    return { error: 'Player limit reached' }
  } else if (game.status !== 'lobby') {
    return { error: 'This game is already in progress or finished' }
  } else {
    const player = (await createPlayer(gameId, socketId)) as any
    const allPlayers = await findAllPlayersInGame(gameId)
    return { game, player, allPlayers }
  }
}

export const startGame = async (gameId: string) => {
  await updateGameStatus(gameId, 'playing')
  const players = (await findAllPlayersInGame(gameId)) as any[]
  await updateOrderOfPlaying(
    players,
    shuffleArray([...Array(players.length)].map((_, index) => index))
  )
}

export const getGameSummary = async (gameId: string) => {
  return findGameByIdWithTurnsData(gameId)
}
