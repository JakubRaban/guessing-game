import { Router } from 'express'
import gamesRouter from './games'

const router = Router()

router.use('/games', gamesRouter)

router.get('/', (req, res) => {
  res.send('Z kopyta kulig rwiee')
})

export default router
