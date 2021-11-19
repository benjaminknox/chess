import qs from 'qs'
import axios from 'axios'
import request from 'supertest'
import config, { IConfig } from './config'

jest.mock('./config')

const token = 'test-token'
const authResponseBody = { access_token: token }

jest.mock('axios')

import app from './app'

describe('app', () => {
  describe('when calling home route', () => {
    it('shows chess emoji icon', async () => {
      const response = await request(app.callback()).get('/')
      expect(response.status).toBe(200)
      expect(response.text).toBe('{"🦸" :" ♚ ♛ ♜ ♝ ♞ ♟", "🤸":"♔ ♕ ♖ ♗ ♘ ♙"}')
    })
  })

  describe('when logging in', () => {
    const getAuthString = (username: string, password: string) =>
      Buffer.from(`${username}:${password}`).toString('base64')

    const login = async (auth: string) =>
      await request(app.callback()).post('/api/jwt/login').send({ auth })

    afterEach(() => {
      jest.resetAllMocks()
    })

    afterAll(() => {
      jest.clearAllMocks()
    })

    describe('accessing a route without authorization', () => {
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

    describe('accessing a route with authorization', () => {
      it('allows access to route', async () => {
        //@ts-ignore
        axios.mockImplementation(() =>
          Promise.resolve({
            response: {
              status: 200,
            },
          })
        )

        const response = await request(app.callback()).get('/games').send()

        expect(response.status).toBe(200)
        expect(response.text).toBe('games!')
      })
    })

    describe('when the user is not valid', () => {
      beforeEach(() => {
        //@ts-ignore
        axios.mockImplementation(() =>
          Promise.reject({
            response: {
              status: 401,
            },
          })
        )
      })

      it('returns 401', async () => {
        const response = await login(getAuthString('user', 'password'))

        expect(response.status).toBe(401)
        expect(response.text).toBe('Unauthorized')
      })
    })

    describe('when the user is valid', () => {
      const testUser = 'testUser'
      const testPassword = 'testPassword'

      beforeEach(() => {
        //@ts-ignore
        axios.mockImplementation(() =>
          Promise.resolve({
            data: authResponseBody,
          })
        )
      })

      it('successfully logs in and returns access token', async () => {
        const response = await login(getAuthString(testUser, testPassword))

        const params = qs.stringify({
          client_id: config.oauthClientId,
          grant_type: 'password',
          client_secret: config.oauthClientSecret,
          scope: 'openid',
          username: testUser,
          password: testPassword,
        })

        expect(axios).toHaveBeenCalledTimes(1)
        expect(axios).toHaveBeenCalledWith(
          expect.objectContaining({
            data: params,
            method: 'POST',
            url: config.oauthClientUrl,
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
            },
          })
        )

        expect(response.status).toBe(200)
        expect(response.body).toEqual(authResponseBody)
      })
    })
  })

  describe('when refreshing access token', () => {
    const refreshToken = 'test-refresh-token'

    const params = qs.stringify({
      client_id: config.oauthClientId,
      grant_type: 'refresh_token',
      client_secret: config.oauthClientSecret,
      refresh_token: refreshToken,
    })

    const refresh = async () =>
      await request(app.callback()).post('/api/jwt/refresh').send({ token: refreshToken })

    describe('when using an invalid refresh token', () => {
      beforeEach(() => {
        //@ts-ignore
        axios.mockImplementation(() =>
          Promise.reject({
            response: {
              status: 400,
            },
          })
        )
      })

      it('throws a 400 error', async () => {
        const response = await refresh()

        expect(response.status).toBe(400)
      })
    })

    describe('when using a valid refresh token', () => {
      beforeEach(() => {
        //@ts-ignore
        axios.mockImplementation(() =>
          Promise.resolve({
            data: authResponseBody,
          })
        )
      })

      it('generates a valid access token', async () => {
        const response = await refresh()

        expect(response.status).toBe(200)
        expect(response.body).toEqual(authResponseBody)
      })
    })
  })
})
