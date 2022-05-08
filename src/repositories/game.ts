import sequelize from '../models'
import { GameStatus } from '../../client/src/types/game'

const { Game, GameOptions, Player, Turn } = sequelize.models

export const findGameById = (urlId: string) => {
  return Game.findOne({
    where: { urlId },
    include: [Player, GameOptions],
  })
}

export const findGameByIdWithTurnsData = (urlId: string) => {
  return Game.findOne({
    where: { urlId },
    include: [
      {
        model: Player,
        include: [{ model: Turn }],
      },
    ],
    order: [
      [Player, 'orderOfPlaying', 'ASC'],
      [Player, Turn, 'createdAt', 'ASC'],
    ],
  })
}

export const updateGameStatus = (gameId: string, status: GameStatus) => {
  return Game.update({ status }, { where: { urlId: gameId } })
}
