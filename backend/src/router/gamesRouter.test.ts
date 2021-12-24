import axios from 'axios'
import request from 'supertest'
import { getConfig } from 'config'
import { GameModel } from 'entities'

jest.mock('axios')

import app from 'app'

describe('gamesRouter', () => {
  const player1 = 'player1'
  const player2 = 'player2'
  let server: any

  beforeEach(() => {
    server = app()
  })

  beforeAll(() => {
    //@ts-ignore
    axios.mockImplementation(() =>
      Promise.resolve({
        data: {},
      })
    )
  })

  afterAll(() => {
    jest.clearAllMocks()
  })

  describe('when creating a game', () => {
    it('creates games with correct players', async () => {
      const player3 = 'player3'
      const player4 = 'player4'

      await request(server.callback()).post('/games').send({
        white_player: player1,
        black_player: player2,
      })

      await request(server.callback()).post('/games').send({
        white_player: player3,
        black_player: player4,
      })

      const gameModels = await GameModel.find().exec()

      expect(gameModels.length).toBe(2)
      expect(gameModels[0].white_player).toBe(player1)
      expect(gameModels[0].black_player).toBe(player2)
      expect(gameModels[1].white_player).toBe(player3)
      expect(gameModels[1].black_player).toBe(player4)
    })
  })

  describe('when game exists', () => {
    it('should return an existing game', async () => {
      const { id } = (
        await request(server.callback()).post('/games').send({
          white_player: player1,
          black_player: player2,
        })
      ).body

      const response = await request(server.callback()).get(`/games/${id}`)

      expect(response.body.id).toStrictEqual(id)
    })
  })

  describe("when game doesn't exist", () => {
    it('should return 404', async () => {
      const response = await request(server.callback()).get(`/games/test-uuid-for-game`)

      expect(response.statusCode).toBe(404)
    })
  })

  describe('when player moves', () => {
    it('adds a move to the collection', async () => {
      const gameResponse = await request(server.callback()).post('/games').send({
        white_player: player1,
        black_player: player2,
      })

      const firstMove = 'first-move'

      await request(server.callback()).post(`/games/${gameResponse.body.id}`).send({
        move: firstMove,
      })

      const secondMove = 'second-move'

      await request(server.callback()).post(`/games/${gameResponse.body.id}`).send({
        move: secondMove,
      })

      const gameModels = await GameModel.find().exec()

      expect(gameModels[0].moves.length).toBe(2)

      expect(gameModels[0].moves[0].move).toBe(firstMove)
      expect(gameModels[0].moves[0].move_number).toBe(1)

      expect(gameModels[0].moves[1].move).toBe(secondMove)
      expect(gameModels[0].moves[1].move_number).toBe(2)
    })
  })
})
