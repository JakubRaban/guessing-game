import { Model, Sequelize } from 'sequelize'

export type ModelDefiner = (sequelize: Sequelize) => typeof Model
