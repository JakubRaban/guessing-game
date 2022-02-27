import { Router } from 'express'
import gamesRouter from './games'
import { findGameById } from '../repositories/game';

const router = Router()

router.use('/games', gamesRouter)

router.get('/', (req, res) => {
  res.send('Z kopyta kulig rwiee')
})

router.get('/test', async (req, res) => {
  res.send(await findGameById('zgs-qfp-jcb'))
})

export default router
