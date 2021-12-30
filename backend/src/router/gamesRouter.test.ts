import axios from 'axios'
import request from 'supertest'
import { GameModel } from 'entities'

jest.mock('axios')
jest.mock('bootstrap/redis')

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
    axios.mockImplementation(request =>
      Promise.resolve({
        data: request.url === 'http://test-client/validate' ? { sub: 'player1' } : {},
      })
    )
  })

  afterAll(() => {
    jest.clearAllMocks()
  })

  describe('when creating a game', () => {
    it('creates games with correct players and configuration', async () => {
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

      const firstMove = {
        move: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
        move_number: 1,
      }

      expect(gameModels.length).toBe(2)
      expect(gameModels[0].white_player).toBe(player1)
      expect(gameModels[0].black_player).toBe(player2)
      expect(gameModels[0].moves[0]).toMatchObject(firstMove)

      expect(gameModels[1].white_player).toBe(player3)
      expect(gameModels[1].black_player).toBe(player4)
      expect(gameModels[1].moves[0]).toMatchObject(firstMove)
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

    describe('when player moves', () => {
      let gameResponse: any
      const firstMove = 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1'
      const secondMove = 'rnbqkbnr/ppp1pppp/8/3p4/4P3/8/PPPP1PPP/RNBQKBNR w KQkq d6 0 2'

      beforeEach(async () => {
        gameResponse = await request(server.callback()).post('/games').send({
          white_player: player1,
          black_player: player2,
        })

        await request(server.callback())
          .post(`/games/${gameResponse.body.id}/move`)
          .send({
            move: firstMove,
          })

        await request(server.callback())
          .post(`/games/${gameResponse.body.id}/move`)
          .send({
            move: secondMove,
          })
      })

      describe('when the move is valid', () => {
        it('adds a move to the collection', async () => {
          const gameModels = await GameModel.find().exec()

          expect(gameModels[0].moves.length).toBe(2)

          expect(gameModels[0].moves[1].move).toBe(firstMove)
          expect(gameModels[0].moves[1].move_number).toBe(2)
        })
      })

      describe('when the move is invalid', () => {
        const illegalMove =
          'rnbqkbnr/pp2pppp/8/2pp4/4P3/8/PPPP1PPP/RNBQKBNR w KQkq e3 0 2'

        describe('when the black moves but it is not the logged in user move', () => {
          it('should not save the move', async () => {
            const response = await request(server.callback())
              .post(`/games/${gameResponse.body.id}/move`)
              .send({
                move: secondMove,
              })

            expect(response.statusCode).toBe(422)
          })
        })
      })
    })
  })

  describe("when game doesn't exist", () => {
    it('should return 404', async () => {
      const response = await request(server.callback()).get(`/games/test-uuid-for-game`)

      expect(response.statusCode).toBe(404)
    })
  })
})
