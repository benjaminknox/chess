import qs from 'qs'
import axios from 'axios'
import request from 'supertest'
import config, { IConfig } from 'config'

jest.mock('config')

const token = 'test-token'
const authResponseBody = { access_token: token }

jest.mock('axios')

import app from 'app'

describe('app', () => {
  describe('when logging in', () => {
    afterEach(() => {
      jest.resetAllMocks()
    })

    afterAll(() => {
      jest.clearAllMocks()
    })

    describe('when accessing a route without authorization', () => {
      it('throws a 401 auth error', async () => {
        //@ts-ignore
        axios.mockImplementation(() =>
          Promise.reject({
            response: {
              status: 401,
            },
          })
        )

        const response = await request(app.callback()).get('/games').send()

        expect(response.status).toBe(401)
        expect(response.text).toBe('Unauthorized')
      })
    })

    describe('when accessing a route with authorization', () => {
      beforeEach(() => {
        //@ts-ignore
        axios.mockImplementation(routes => {
          return Promise.resolve({
            status: 200,
          })
        })
      })

      it('allows access to route', async () => {
        const response = await request(app.callback()).get('/games').send()

        expect(response.status).toBe(200)
        expect(response.text).toBe('games!')
      })
    })
  })
})
