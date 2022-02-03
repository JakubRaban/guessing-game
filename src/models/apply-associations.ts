import { Sequelize } from 'sequelize'

export const applyAssociations = (sequelize: Sequelize) => {
  const { Player, Game, Turn, Vote, GameOptions } = sequelize.models

  Player.belongsTo(Game, { foreignKey: { allowNull: false } })
  Game.hasMany(Player)

  Turn.belongsTo(Player, { foreignKey: { allowNull: false } })
  Player.hasMany(Turn)

  GameOptions.belongsTo(Game)
  Game.hasOne(GameOptions)

  Vote.belongsTo(Turn)
  Vote.belongsTo(Player)
  Turn.hasMany(Vote)
  Player.hasMany(Vote)
}
