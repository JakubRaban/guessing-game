import { Router } from 'express'
import sequelize from '../models'

const router = Router()
const { Game, GameOptions } = sequelize.models

router.post('/', async (req, res) => {
  const game = await Game.create()
  // @ts-ignore
  const options = await game.createGameOption(req.body)
  res.send({ game, options })
})

router.get('/:id', (req, res) => {
  return Game.findOne({
    where: { urlId: req.params.id },
    include: [{ model: GameOptions, as: 'options' }],
  }).then((game) => {
    res.send(game)
  })
})

export default router
