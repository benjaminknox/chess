import cors from '@koa/cors'
import { default as Koa } from 'koa'
import bodyParser from 'koa-bodyparser'
import { validateToken, logUrl, database } from 'middlewares'
import { jwtRouter, homeRouter, userRouter, gamesRouter } from 'router'

const app: Koa = new Koa()

database()

app.use(cors())

app.use(logUrl)
app.use(validateToken)

app.use(bodyParser())

app.use(jwtRouter.routes())
app.use(homeRouter.routes())
app.use(userRouter.routes())
app.use(userRouter.routes())
app.use(gamesRouter.routes())

export default app
