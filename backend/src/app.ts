import qs from 'qs'
import axios from 'axios'
import config from './config'
import bodyParser from 'koa-bodyparser'
import { default as Router } from 'koa-router'
import { default as Koa, Context, Next } from 'koa'

const app: Koa = new Koa()

app.use(bodyParser())

app.use(async (ctx: Context, next: Next) => {
  // Log the request to the console
  console.log('Url:', ctx.url)
  // Pass the request to the next middleware function
  await next()
})

const router: Router = new Router()

router.get('/', async (ctx: Context) => {
  ctx.body = '{"🦸" :" ♚ ♛ ♜ ♝ ♞ ♟", "🤸":"♔ ♕ ♖ ♗ ♘ ♙"}'
})

router.post('/api/jwt/login', async (ctx: Context) => {
  const [username, password] = Buffer.from(ctx.request.body.auth, 'base64')
    .toString('utf-8')
    .split(':')

  await axios({
    url: config.oauthClientUrl,
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
    data: qs.stringify({
      client_id: config.oauthClientId,
      grant_type: 'password',
      client_secret: config.oauthClientSecret,
      scope: 'openid',
      username,
      password,
    }),
  })
    .then((response: any) => {
      ctx.body = response.data
      ctx.status = 200
    })
    .catch((error: any) => {
      ctx.status = error.response.status
    })
})

router.post('/api/jwt/refresh', async (ctx: Context) => {
  await axios({
    url: config.oauthClientUrl,
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
    data: qs.stringify({
      client_id: config.oauthClientId,
      grant_type: 'refresh_token',
      client_secret: config.oauthClientSecret,
      refresh_token: ctx.request.body.token,
    }),
  })
    .then((response: any) => {
      ctx.body = response.data
      ctx.status = 200
    })
    .catch((error: any) => {
      ctx.status = error.response.status
    })
})

app.use(router.routes())

export default app
