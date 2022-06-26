import cors from '@koa/cors'
import { database } from 'bootstrap'
import { default as Koa } from 'koa'
import bodyParser from 'koa-bodyparser'
import { validateToken, logUrl, websocket } from 'middlewares'
import apiRouter from 'router/apiRouter'

const app = () => {
  const koa: Koa & { ws: any } = websocket(new Koa())

  database()

  koa.use(cors())

  koa.use(logUrl)
  koa.use(validateToken)

  koa.use(bodyParser())

  koa.use(apiRouter.http.routes())
  koa.ws.use(apiRouter.ws.routes())

  return koa
}

export default app
