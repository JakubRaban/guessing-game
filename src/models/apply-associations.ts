import { Sequelize } from 'sequelize'

export const applyAssociations = (sequelize: Sequelize) => {
  const { Player, Game, Turn, GameOptions } = sequelize.models

  Player.belongsTo(Game, { foreignKey: { allowNull: false } })
  Player.belongsTo(Player, { as: 'assignedByPlayer' })
  Turn.belongsTo(Player, { foreignKey: { allowNull: false } })

  Game.hasOne(GameOptions)
  GameOptions.belongsTo(Game)
}
