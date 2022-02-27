import { findAllPlayersInGame, updatePlayerName } from '../repositories/player'

export const setName = async (
  playerId: string,
  name: string,
  gameId: string
) => {
  // TODO disallow this outside 'lobby' game state
  await updatePlayerName(playerId, name)
  return { allPlayers: await findAllPlayersInGame(gameId) }
}
