import qs from 'qs'
import axios from 'axios'
import config from 'config'
import { Context } from 'koa'
import { default as Router } from 'koa-router'

const jwtRouter: Router = new Router({
  prefix: '/api/jwt',
})

jwtRouter.post('/login', async (ctx: Context) => {
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

jwtRouter.post('/refresh', async (ctx: Context) => {
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

export default jwtRouter
