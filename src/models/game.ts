import { DataTypes, Model, Sequelize } from 'sequelize'

class Game extends Model {}

export default (sequelize: Sequelize) => {
  Game.init(
    {
      urlId: { type: DataTypes.STRING(12), allowNull: false },
      status: {
        type: DataTypes.ENUM('lobby', 'playing', 'finished'),
        allowNull: false,
      },
    },
    {
      sequelize,
      indexes: [{ unique: true, fields: ['urlId'] }],
    }
  )

  return Game
}
