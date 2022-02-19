import sequelize from '../models'

const { Game, GameOptions, Player } = sequelize.models

export const findGameById = (urlId: string) => {
  return Game.findOne({
    where: { urlId },
    include: [Player, GameOptions],
  })
}
