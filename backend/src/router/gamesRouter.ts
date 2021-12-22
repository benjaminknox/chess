import { Context } from 'koa'
import { GameModel } from 'entities'
import { default as Router } from 'koa-router'

const gameRouter: Router = new Router({
  prefix: '/games',
})

gameRouter.get('/', async (ctx: Context) => {
  const game = await GameModel.create({
    white_player: 'player1',
    black_player: 'player2',
    moves: [
      {
        move: 'example-move-key',
        move_number: 1,
      },
    ],
  })

  try {
    const getGame = await GameModel.findById(game._id).exec()
    ctx.body = getGame
  } catch(ex) {
    console.log(ex)
  }

  ctx.status = 200
})

export default gameRouter
