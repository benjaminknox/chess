import axios from 'axios'
import { getConfig } from 'config'
import { Context, Next } from 'koa'

function authRequired(context: Context): boolean {
  return context.url !== '/' && !context.url.startsWith('/api/jwt')
}

const validateToken = async (context: Context, next: Next) => {
  if (authRequired(context)) {
    await axios({
      url: getConfig().oauthValidationUrl,
      method: 'POST',
      headers: {
        authorization: context.request.header.authorization ?? '',
      },
    })
      .then((response: any) => {
        context.user = response.data
        return next()
      })
      .catch((error: any) => {
        console.log(error)
        context.status = 401
      })
  } else {
    await next()
  }
}

export { validateToken }
