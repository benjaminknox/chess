import cors from '@koa/cors'
import { default as Koa } from 'koa'
import bodyParser from 'koa-bodyparser'
import { validateToken, logUrl } from 'middlewares'
import { jwtRouter, homeRouter, userRouter } from 'router'

const app: Koa = new Koa()

app.use(logUrl)
app.use(validateToken)

app.use(bodyParser())
app.use(cors({ origin: '*' }))

app.use(jwtRouter.routes())
app.use(homeRouter.routes())
app.use(userRouter.routes())

export default app
