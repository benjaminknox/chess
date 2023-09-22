import qs from 'qs'
import axios from 'axios'
import { Context } from 'koa'
import { getConfig } from 'config'
import { NotificationModel } from 'entities'
import { default as Router } from 'koa-router'

const config = { prefix: '/notifications' }

const notificationRouter = { http: new Router(config), ws: new Router(config) }

notificationRouter.http.post('/', async (context: Context) => {
  try {
    const player_id = context.request.body.player_id
    const message = context.request.body.message
    const game_id = context.request.body.game_id

    const notification = await NotificationModel.create({
      player_id,
      message,
      game_id
    })

    context.body = await NotificationModel.findOne({ _id: notification._id }).exec()

    context.status = 200
  } catch (ex) {
    throw ex
  }
})

notificationRouter.http.get('/:id', async (context: Context) => {
  try {
    const notification = await NotificationModel.findOne({ id: context.params.id }).exec()

    if (notification) {
      context.body = notification
      context.status = 200
    } else {
      context.status = 404
    }
  } catch (ex) {
    throw ex
  }
})

notificationRouter.http.get('/', async (context: Context) => {
  try {
    const notifications = await NotificationModel.find({ id: context.params.id }).exec()

    if (notifications) {
      context.body = notifications
      context.status = 200
    } else {
      context.status = 404
    }
  } catch (ex) {
    throw ex
  }
})

export default notificationRouter
