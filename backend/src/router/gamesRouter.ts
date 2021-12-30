import { Chess } from 'chess.js'
import { Context } from 'koa'
import { createClient } from 'redis'
import { default as Router } from 'koa-router'
import { publishMessage } from 'bootstrap/redis'
import { GameModel, GameMoveModel } from 'entities'

const config = { prefix: '/games' }

const gameRouter = { http: new Router(config), ws: new Router(config) }

gameRouter.http.post('/', async (ctx: Context) => {
  try {
    const white_player = ctx.request.body.white_player
    const black_player = ctx.request.body.black_player

    const firstMove = new GameMoveModel()

    firstMove.move = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'
    firstMove.move_number = 1

    const game = await GameModel.create({
      white_player,
      black_player,
      moves: [firstMove],
    })

    ctx.body = await GameModel.findOne({ id: game.id }).exec()

    ctx.status = 200
  } catch (ex) {
    throw ex
  }
})

gameRouter.http.get('/:id', async (ctx: Context) => {
  try {
    const game = await GameModel.findOne({ id: ctx.params.id }).exec()

    if (game) {
      ctx.body = game
      ctx.status = 200
    } else {
      ctx.status = 404
    }
  } catch (ex) {
    throw ex
  }
})

gameRouter.http.post('/:id/move', async (ctx: Context) => {
  try {
    let game = await GameModel.findOne({ id: ctx.params.id }).exec()
    if (game) {
      const turn =
        new Chess(game.moves[game.moves.length - 1].move).turn() === 'b'
          ? 'black_player'
          : 'white_player'

      if (ctx.user.sub !== game[turn]) {
        ctx.status = 422
      } else {
        const gameMove = new GameMoveModel()

        gameMove.move = ctx.request.body.move
        gameMove.move_number = game.moves.length + 1

        game.moves.push(gameMove)

        publishMessage('gameMove', gameMove.move)

        game = await game.save()

        ctx.body = game

        ctx.status = 200
      }
    } else {
      ctx.status = 404
    }
  } catch (ex) {
    throw ex
  }
})

export default gameRouter
