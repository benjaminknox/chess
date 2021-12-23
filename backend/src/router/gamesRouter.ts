import { Context } from 'koa'
import { GameModel } from 'entities'
import { default as Router } from 'koa-router'

const gameRouter: Router = new Router({
  prefix: '/games',
})

gameRouter.post('/', async (ctx: Context) => {
  const white_player = ctx.request.body.white_player
  const black_player = ctx.request.body.black_player

  const game = await GameModel.create({
    white_player,
    black_player,
    moves: [],
  })

  try {
    const getGame = await GameModel.findById(game._id).exec()
    ctx.body = getGame
  } catch (ex) {
    console.log(ex)
  }

  ctx.status = 200
})

export default gameRouter
