// Setup sequelize ORM
import { Sequelize } from 'sequelize'
import { ModelDefiner } from './models.types'
import { applyAssociations } from './apply-config'
import Game from './game'
import Player from './player'
import Turn from './turn'

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite',
})

const modelDefiners: ModelDefiner[] = [Game, Player, Turn]

modelDefiners.forEach((modelDefiner) => {
  modelDefiner(sequelize)
})

applyAssociations(sequelize)

export default sequelize
