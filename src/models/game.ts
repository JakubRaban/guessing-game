import { DataTypes, Model, Sequelize } from 'sequelize'
import { generateGameId } from '../helpers/algorithms'

class Game extends Model {}

export default (sequelize: Sequelize) => {
  Game.init(
    {
      urlId: {
        type: DataTypes.STRING(12),
        primaryKey: true,
        allowNull: false,
        defaultValue: generateGameId,
      },
      status: {
        type: DataTypes.ENUM('lobby', 'playing', 'finished'),
        allowNull: false,
        defaultValue: 'lobby',
      },
    },
    {
      sequelize,
    }
  )

  return Game
}
