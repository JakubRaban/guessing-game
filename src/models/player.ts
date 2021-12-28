import { DataTypes, Model, Sequelize } from 'sequelize'

class Player extends Model {}

export default (sequelize: Sequelize) => {
  Player.init(
    {
      name: { type: DataTypes.STRING(12), allowNull: false },
      assignedPuzzle: { type: DataTypes.STRING(64) },
      puzzleInfoPage: { type: DataTypes.STRING, validate: { isUrl: true } },
    },
    {
      sequelize,
    }
  )
  return Player
}
