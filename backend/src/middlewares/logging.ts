import { Context, Next } from 'koa'

const logUrl = async (ctx: Context, next: Next) => {
  console.log('Url:', ctx.url)
  await next()
}

export { logUrl }
