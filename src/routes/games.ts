import { Router } from 'express'
import sequelize from '../models'

const router = Router()
const { Game, GameOptions } = sequelize.models

router.post('/', async (req, res) => {
  const game = await Game.create()
  // @ts-ignore
  const options = await game.createGameOption(req.body)
  const gameInstance = game.get()
  gameInstance.GameOption = options.get()
  res.send(gameInstance)
})

router.get('/:id', (req, res) => {
  Game.findOne({
    where: { urlId: req.params.id },
    include: [{ model: GameOptions }],
  }).then((game) => {
    res.send(game.get())
  })
})

export default router
