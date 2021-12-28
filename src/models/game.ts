import { DataTypes, Model } from 'sequelize'
import { sequelize } from '../app'

export class Game extends Model {}

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
