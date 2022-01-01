import { Context } from 'koa'
import { Chess } from 'chess.js'
import { createClient } from 'redis'
import { default as Router } from 'koa-router'
import { GameModel, GameMoveModel } from 'entities'
import { publishMessage, subscribe } from 'bootstrap/redis'

const config = { prefix: '/games' }

const gameRouter = { http: new Router(config), ws: new Router(config) }

gameRouter.http.post('/', async (context: Context) => {
  try {
    const white_player = context.request.body.white_player
    const black_player = context.request.body.black_player

    const firstMove = new GameMoveModel()

    firstMove.move = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'
    firstMove.move_number = 1

    const game = await GameModel.create({
      white_player,
      black_player,
      moves: [firstMove],
    })

    context.body = await GameModel.findOne({ id: game.id }).exec()

    context.status = 200
  } catch (ex) {
    throw ex
  }
})

gameRouter.http.get('/latest', async (context: Context) => {
  try {
    const game = await GameModel.findOne({
      $or: [{ white_player: context.user.sub }, { black_player: context.user.sub }],
    })
      .sort({ createdAt: -1 })
      .exec()

    if (game) {
      context.body = game
      context.status = 200
    } else {
      context.status = 404
    }
  } catch (ex) {
    throw ex
  }
})

gameRouter.http.get('/:id', async (context: Context) => {
  try {
    const game = await GameModel.findOne({ id: context.params.id }).exec()

    if (game) {
      context.body = game
      context.status = 200
    } else {
      context.status = 404
    }
  } catch (ex) {
    throw ex
  }
})

gameRouter.http.post('/:id/move', async (context: Context) => {
  try {
    let game = await GameModel.findOne({ id: context.params.id }).exec()
    if (game) {
      const turn =
        new Chess(game.moves[game.moves.length - 1].move).turn() === 'b'
          ? 'black_player'
          : 'white_player'

      if (context.user.sub !== game[turn]) {
        context.status = 422
      } else {
        const gameMove = new GameMoveModel()

        gameMove.move = context.request.body.move
        gameMove.move_number = game.moves.length + 1

        game.moves.push(gameMove)

        publishMessage('gameMove', gameMove.move)

        game = await game.save()

        context.body = game

        context.status = 200
      }
    } else {
      context.status = 404
    }
  } catch (ex) {
    throw ex
  }
})

gameRouter.ws.get('/:id', async (context: Context) => {
  subscribe('gameMove', context)
})

export default gameRouter
