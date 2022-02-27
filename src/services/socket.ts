import { deletePlayer, findAllPlayersInGame } from '../repositories/player'

export const disconnect = async (socketId: string, gameId: string) => {
  await deletePlayer(socketId)
  return findAllPlayersInGame(gameId)
}
