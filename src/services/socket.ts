import { deletePlayer, findAllPlayersInGame } from '../repositories/player'
import { findGameById } from '../repositories/game'

export const disconnect = async (socketId: string, gameId: string) => {
  const game = (await findGameById(gameId)) as any
  if (game.status === 'lobby' && socketId) {
    await deletePlayer(socketId)
  }
  return findAllPlayersInGame(gameId)
}
