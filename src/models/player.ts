import { DataTypes, Model, Sequelize } from 'sequelize'

class Player extends Model {}

export default (sequelize: Sequelize) => {
  Player.init(
    {
      name: { type: DataTypes.STRING(12) },
      socketId: { type: DataTypes.STRING(20), allowNull: false },
      orderOfPlaying: { type: DataTypes.INTEGER },
      assignedPuzzle: { type: DataTypes.STRING(64) },
      puzzleInfoPage: {
        type: DataTypes.STRING(128),
        validate: { isUrl: true },
      },
    },
    {
      sequelize,
    }
  )
  return Player
}
