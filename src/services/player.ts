import {
  findAllPlayersInGame,
  findAllPlayersInGameByOrderOfPlaying,
  updatePlayerName,
  updatePuzzle,
} from '../repositories/player'
import { PuzzleData } from '../../client/src/types/game'

export const setName = async (
  playerId: string,
  name: string,
  gameId: string
) => {
  // TODO disallow this outside 'lobby' game state
  await updatePlayerName(playerId, name)
  return { allPlayers: await findAllPlayersInGame(gameId) }
}
export const assignPuzzle = async (
  gameId: string,
  assigningPlayerId: string,
  puzzleData: PuzzleData
) => {
  const players = await findAllPlayersInGameByOrderOfPlaying(gameId)
  const assigningPlayerIndex = players.findIndex(
    (player) => (player as any).socketId === assigningPlayerId
  )
  const playerBeingAssigned = players[
    (assigningPlayerIndex + 1) % players.length
  ] as any
  await updatePuzzle(playerBeingAssigned.id, puzzleData)
  return { playerBeingAssignedId: playerBeingAssigned.socketId }
}
