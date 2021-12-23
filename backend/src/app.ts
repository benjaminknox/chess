import cors from '@koa/cors'
import { database } from 'bootstrap'
import { default as Koa } from 'koa'
import bodyParser from 'koa-bodyparser'
import { validateToken, logUrl } from 'middlewares'
import { jwtRouter, homeRouter, userRouter, gamesRouter } from 'router'

const app = () => {
  const koa: Koa = new Koa()

  database()

  koa.use(cors())

  koa.use(logUrl)
  koa.use(validateToken)

  koa.use(bodyParser())

  koa.use(jwtRouter.routes())
  koa.use(homeRouter.routes())
  koa.use(userRouter.routes())
  koa.use(userRouter.routes())
  koa.use(gamesRouter.routes())

  return koa
}

export default app
