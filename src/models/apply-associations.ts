import { Sequelize } from 'sequelize'

export const applyAssociations = (sequelize: Sequelize) => {
  const { Player, Game, Turn, GameOptions } = sequelize.models

  Player.belongsTo(Game, { foreignKey: { allowNull: false } })
  Game.hasMany(Player)

  Player.belongsTo(Player, { as: 'assignedByPlayer' })

  Turn.belongsTo(Player, { foreignKey: { allowNull: false } })
  Player.hasMany(Turn)

  GameOptions.belongsTo(Game)
  Game.hasOne(GameOptions)
}
