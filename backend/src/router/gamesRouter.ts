import { Context } from 'koa'
import { GameModel } from 'entities'
import { default as Router } from 'koa-router'

const gameRouter: Router = new Router({
  prefix: '/games',
})

gameRouter.get('/', async (ctx: Context) => {
  //ctx.status = 200
  //const game = await GameModel.create({
  //  white_player: 'ben',
  //  black_player: 'ben2',
  //  moves: [
  //    {
  //      move: 'awef;iajwefj',
  //      move_number: 1,
  //    },
  //  ],
  //})

  //try {
  //  console.log("thing")
  //  const getGame = await GameModel.findById(game._id).exec()
  //  ctx.body = getGame
  //} catch(ex) {
  //  console.log(ex)
  //}
})

export default gameRouter
