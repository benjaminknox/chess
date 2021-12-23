import axios from 'axios'
import request from 'supertest'
import { getConfig } from 'config'
import { GameModel } from 'entities'

jest.mock('axios')

import app from 'app'

describe('gamesRouter', () => {
  beforeEach(() => {
    //@ts-ignore
    axios.mockImplementation(() =>
      Promise.resolve({
        data: {},
      })
    )
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('when creating a game', () => {
    it('creates games with correct players', async () => {
      const player1 = 'player1'
      const player2 = 'player2'
      const player3 = 'player3'
      const player4 = 'player4'

      await request(app().callback()).post('/games').send({
        white_player: player1,
        black_player: player2,
      })

      await request(app().callback()).post('/games').send({
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
})
