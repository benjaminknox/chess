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
    it('inserts into database', async () => {
      await request(app().callback()).get('/games')
      await request(app().callback()).get('/games')

      const gameModels = await GameModel.find().exec()

      expect(gameModels.length).toBe(2)
    })
  })
})
