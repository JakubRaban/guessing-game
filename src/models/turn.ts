import { DataTypes, Model } from 'sequelize'
import { sequelize } from '../app'
import { Player } from './player'

export class Turn extends Model {}

Turn.init(
  {
    turnType: { type: DataTypes.ENUM('question', 'answer'), allowNull: false },
    text: { type: DataTypes.STRING(128), allowNull: false },
    voteResult: { type: DataTypes.ENUM('yes', 'no', '?') },
  },
  {
    sequelize,
  }
)

Turn.belongsTo(Player)
