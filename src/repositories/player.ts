import sequelize from '../models'
import { PuzzleData } from '../../client/src/types/game'

const { Player } = sequelize.models

export const createPlayer = (gameId: string, socketId: string) => {
  return Player.create({ socketId, GameUrlId: gameId })
}

export const findPlayerById = (socketId: string) => {
  return Player.findOne({ where: { socketId } })
}

export const findAllPlayersInGame = (gameId: string) => {
  return Player.findAll({ where: { GameUrlId: gameId } })
}

export const findAllPlayersInGameByOrderOfPlaying = (gameId: string) => {
  return Player.findAll({
    where: { GameUrlId: gameId },
    order: ['orderOfPlaying'],
  })
}

export const updatePlayerName = (socketId: string, name: string) => {
  return Player.update({ name }, { where: { socketId } })
}

export const updateOrderOfPlaying = (players: any[], newOrder: number[]) => {
  return Player.bulkCreate(
    players.map((player, index) => ({
      ...player.get(),
      orderOfPlaying: newOrder[index],
    })),
    { updateOnDuplicate: ['orderOfPlaying'] }
  )
}

export const updatePuzzle = (socketId: string, puzzleData: PuzzleData) => {
  return Player.update(puzzleData, { where: { id: socketId } })
}

export const deletePlayer = (socketId: string) => {
  return Player.destroy({ where: { socketId } })
}
