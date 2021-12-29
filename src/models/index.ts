// Setup sequelize ORM
import { Sequelize } from 'sequelize'
import { ModelDefiner } from './models.types'
import { applyAssociations } from './apply-associations'
import Game from './game'
import Player from './player'
import Turn from './turn'
import GameOptions from './game-options'

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite',
})

const modelDefiners: ModelDefiner[] = [Game, Player, Turn, GameOptions]

modelDefiners.forEach((modelDefiner) => modelDefiner(sequelize))

applyAssociations(sequelize)

export default sequelize
