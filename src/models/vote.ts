import { DataTypes, Model, Sequelize } from 'sequelize'

class Vote extends Model {}

export default (sequelize: Sequelize) => {
  Vote.init(
    {
      vote: {
        type: DataTypes.ENUM('yes', 'no', '?', 'discuss'),
        allowNull: false,
      },
    },
    { sequelize }
  )
  return Vote
}
