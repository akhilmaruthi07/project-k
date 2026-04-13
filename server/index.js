import 'dotenv/config'
import express from 'express'
import cors from 'cors'

import { authRouter } from './routes/auth.js'
import { noticesRouter } from './routes/notices.js'

const app = express()

app.use(
  cors({
    origin: process.env.CORS_ORIGIN?.split(',').map((s) => s.trim()) || '*',
    credentials: true,
  }),
)
app.use(express.json({ limit: '1mb' }))

app.get('/health', (_req, res) => res.json({ ok: true }))

app.use('/api/auth', authRouter)
app.use('/api/notices', noticesRouter)

const port = Number(process.env.PORT || 8080)
app.listen(port, () => {
  console.log(`[api] listening on :${port}`)
})

