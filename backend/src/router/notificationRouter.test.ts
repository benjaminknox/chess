import axios from 'axios'
import request from 'supertest'
import { NotificationModel } from 'entities'

jest.mock('axios')
jest.mock('bootstrap/redis')

import app from 'app'

describe('notificationRouter', () => {
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

  describe('when creating a notification', () => {
    it('creates a notification for the player', async () => {
      const player_id = 'test-player-id';
      const message =  'test-message';
      const game_id = "test-game-id";

      const response = await request(server.callback()).post('/api/notifications').send({
        player_id,
        message,
        game_id
      })

      const notificationModels = await NotificationModel.find().exec()

      expect(notificationModels[0].player_id).toBe(player_id)
      expect(notificationModels[0].message).toBe(message)
      expect(notificationModels[0].game_id).toBe(game_id)
    })
  })

  describe('when notification exists', () => {
    it('should return a notification', async () => {

      const player_id = 'test-player-id';
      const message =  'test-message';
      const game_id = "test-game-id";

      const { _id } = (await request(server.callback()).post('/api/notifications').send({
        player_id,
        message,
        game_id
      })).body

      const response = await request(server.callback()).get(`/api/notifications/${_id}`)

      expect(response.body._id).toStrictEqual(_id)

    })
  })
})
