import { Context } from 'koa'
import { GameModel, GameMoveModel } from 'entities'
import { default as Router } from 'koa-router'

const gameRouter: Router = new Router({
  prefix: '/games',
})

gameRouter.post('/', async (ctx: Context) => {
  try {
    const white_player = ctx.request.body.white_player
    const black_player = ctx.request.body.black_player

    const game = await GameModel.create({
      white_player,
      black_player,
      moves: [],
    })

    ctx.body = await GameModel.findOne({ id: game.id }).exec()

    ctx.status = 200
  } catch (ex) {
    throw ex
  }
})

gameRouter.post('/:id', async (ctx: Context) => {
  try {
    let game = await GameModel.findOne({ id: ctx.params.id }).exec()

    if (game) {
      const gameMove = new GameMoveModel()

      gameMove.move = ctx.request.body.move
      gameMove.move_number = game.moves.length + 1

      game.moves.push(gameMove)

      game = await game.save()

      ctx.body = game

      ctx.status = 200
    } else {
      ctx.status = 404
    }
  } catch (ex) {
    throw ex
  }
})

export default gameRouter
