import { Context } from 'koa'
import { createClient } from 'redis'
import { subscribe } from 'bootstrap/redis'
import { default as Router } from 'koa-router'

const websocketRouter: Router = new Router({
  prefix: '/websocket',
})

websocketRouter.get('/', async (context: Context) => {
  subscribe('gameMove', context)
})

export default websocketRouter
