import { Sequelize } from 'sequelize'

export const applyAssociations = (sequelize: Sequelize) => {
  const { Player, Game, Turn } = sequelize.models

  Player.belongsTo(Game)
  Player.belongsTo(Player, { as: 'assignedByPlayer' })
  Turn.belongsTo(Player)
}
