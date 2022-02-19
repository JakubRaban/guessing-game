import sequelize from '../models'

const { Player } = sequelize.models

export const createPlayer = (gameId: string, socketId: string) => {
  return Player.create({ socketId, GameUrlId: gameId })
}

export const getAllPlayersInGame = (gameId: string) => {
  return Player.findAll({ where: { GameUrlId: gameId } })
}
