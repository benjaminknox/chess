import axios from 'axios'
import config from 'config'
import { Context, Next } from 'koa'

function authRequired(ctx: Context): boolean {
  return ctx.url !== '/' && !ctx.url.startsWith('/api/jwt')
}

const validateToken = async (ctx: Context, next: Next) => {
  if (authRequired(ctx)) {
    await axios({
      url: config.oauthValidationUrl,
      method: 'POST',
      headers: {
        authorization: ctx.request.header.authorization ?? '',
      },
    })
      .then((response: any) => next())
      .catch((error: any) => {
        ctx.status = 401
      })
  } else {
    await next()
  }
}

export { validateToken }
