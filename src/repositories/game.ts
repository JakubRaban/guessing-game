import sequelize from '../models'
import { GameStatus } from '../../client/src/types/game'

const { Game, GameOptions, Player } = sequelize.models

export const findGameById = (urlId: string) => {
  return Game.findOne({
    where: { urlId },
    include: [Player, GameOptions],
  })
}

export const updateGameStatus = (gameId: string, status: GameStatus) => {
  return Game.update({ status }, { where: { urlId: gameId } })
}
