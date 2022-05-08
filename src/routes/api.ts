import gamesRouter from './games'
import { Router } from 'express'

const router = Router()

router.use('/games', gamesRouter)

export default router
