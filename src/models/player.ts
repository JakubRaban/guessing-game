import { DataTypes, Model } from 'sequelize'
import { sequelize } from '../app'
import { Game } from './game'

export class Player extends Model {}

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

Player.belongsTo(Game)
Player.belongsTo(Player, { as: 'assignedByPlayer' })
