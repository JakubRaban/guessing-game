import { DataTypes, Model, Sequelize } from 'sequelize'

class Turn extends Model {}

export default (sequelize: Sequelize) => {
  Turn.init(
    {
      turnType: {
        type: DataTypes.ENUM('question', 'answer'),
        allowNull: false,
      },
      text: { type: DataTypes.STRING(128), allowNull: false },
      voteResult: { type: DataTypes.ENUM('yes', 'no', '?') },
    },
    {
      sequelize,
    }
  )
  return Turn
}
