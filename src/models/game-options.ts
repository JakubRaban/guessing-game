import { DataTypes, Model, Sequelize } from 'sequelize'

export class GameOptions extends Model {}

export default (sequelize: Sequelize) => {
  GameOptions.init(
    {
      maxPlayers: { type: DataTypes.INTEGER, allowNull: false },
    },
    {
      sequelize,
    }
  )

  return GameOptions
}
