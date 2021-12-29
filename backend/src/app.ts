import cors from '@koa/cors'
import { database } from 'bootstrap'
import { default as Koa } from 'koa'
import bodyParser from 'koa-bodyparser'
import { validateToken, logUrl, websocket } from 'middlewares'
import { jwtRouter, homeRouter, userRouter, gamesRouter, websocketRouter } from 'router'

const app = () => {
  const koa: Koa & { ws: any } = websocket(new Koa())

  database()

  koa.use(cors())

  koa.use(logUrl)
  koa.use(validateToken)

  koa.use(bodyParser())

  koa.use(jwtRouter.routes())
  koa.use(homeRouter.routes())
  koa.use(userRouter.routes())
  koa.use(userRouter.routes())
  koa.use(gamesRouter.http.routes())

  koa.ws.use(websocketRouter.routes())

  return koa
}

export default app
