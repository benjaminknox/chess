import { Context } from 'koa'
import { default as Router } from 'koa-router'

const homeRouter: Router = new Router()

homeRouter.get('/', async (ctx: Context) => {
  ctx.body = '{"🦸" :" ♚ ♛ ♜ ♝ ♞ ♟", "🤸":"♔ ♕ ♖ ♗ ♘ ♙"}'
})

homeRouter.get('/games', async (ctx: Context) => {
  ctx.body = 'games!'
  ctx.status = 200
})

export default homeRouter
