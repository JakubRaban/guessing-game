import { Router } from 'express'
import apiRouter from './api'
import path from 'path'

const router = Router()

router.use('/api', apiRouter)

router.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'))
})

export default router
