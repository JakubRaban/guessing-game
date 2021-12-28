import { Router } from 'express'

const router = Router()

router.get('/', (req, res) => {
  res.send('Z kopyta kulig rwiee')
})

export default router
