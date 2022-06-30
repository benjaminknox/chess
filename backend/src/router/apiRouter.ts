import { default as Router } from 'koa-router'
import { jwtRouter, homeRouter, userRouter, gamesRouter, notificationRouter } from 'router'

const apiRouter = {
  http: new Router({ prefix: '/api' }),
  ws: new Router({ prefix: '/ws' }),
}

apiRouter.http.use(jwtRouter.routes())
apiRouter.http.use(homeRouter.routes())
apiRouter.http.use(userRouter.routes())
apiRouter.http.use(gamesRouter.http.routes())
apiRouter.http.use(notificationRouter.http.routes())

apiRouter.ws.use(gamesRouter.ws.routes())

export default apiRouter
