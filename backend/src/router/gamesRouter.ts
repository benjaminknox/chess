import qs from 'qs'
import axios from 'axios'
import { Context } from 'koa'
import { Chess } from 'chess.js'
import { createClient } from 'redis'
import { getConfig, IConfig } from 'config'
import { default as Router } from 'koa-router'
import { GameModel, GameMoveModel } from 'entities'
import { publishMessage, subscribe } from 'bootstrap/redis'

const config = { prefix: '/games' }

const gameRouter = { http: new Router(config), ws: new Router(config) }

const getKeycloakAdminAccess = async (config: IConfig) =>
  await axios({
    url: `${config.keycloakUri}/auth/realms/${config.keycloakRealm}/protocol/openid-connect/token`,
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
    data: qs.stringify({
      client_id: config.oauthClientId,
      grant_type: 'client_credentials',
      client_secret: config.oauthClientSecret,
    }),
  })

gameRouter.http.get('/', async (context: Context) => {
  const config = getConfig()
  const page = context.request.query.page ? Number(context.request.query.page) : 1
  const pageSize = context.request.query.pageSize
    ? Number(context.request.query.pageSize)
    : 10
  const games = await GameModel.find({
    $or: [{ white_player: context.user.sub }, { black_player: context.user.sub }],
  })
    .skip((page - 1) * pageSize)
    .limit(pageSize)

  const admin: any = await getKeycloakAdminAccess(config)

  const uniquePlayerIds = [
    ...new Set(games.map(game => [game.white_player, game.black_player]).flat(1)),
  ]

  const playersData = Object.assign(
    {},
    ...(
      await Promise.all(
        uniquePlayerIds.map(id =>
          axios({
            url: `${config.keycloakUri}/auth/admin/realms/${config.keycloakRealm}/users/${id}`,
            method: 'GET',
            headers: {
              authorization: `${admin.data.token_type} ${admin.data.access_token}`,
            },
          }).then((response: any) => response.data)
        )
      )
    ).map(player => ({ [player.id]: player }))
  )

  const gamesResult = games.map(game => ({
    ...game.toObject(),
    white_player: playersData[game.white_player],
    black_player: playersData[game.black_player],
  }))

  context.body = gamesResult
  context.status = 200
})

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
