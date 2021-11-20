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
      const keyCloakServiceTokenUrl = `${config.keycloakUri}/auth/realms/${config.keycloakRealm}/protocol/openid-connect/token`
      const keyCloakServiceTokenResp = {
        access_token: 'service-account-access-token',
        expires_in: 600,
        refresh_expires_in: 0,
        token_type: 'Bearer',
        'not-before-policy': 0,
        scope: 'email profile',
      }

      const userListUrl = `${config.keycloakUri}/auth/admin/realms/${config.keycloakRealm}/users`
      const userListResponse = [
        {
          id: '67d99eb9-528t-448c-bc3f-3ei87335f1a5',
          createdTimestamp: 1617669141774,
          username: 'test1',
          enabled: true,
          totp: false,
          emailVerified: true,
          firstName: 'Test1',
          lastName: 'User',
          email: 'test1.user@test.email',
          disableableCredentialTypes: [],
          requiredActions: [],
          notBefore: 0,
          access: {
            manageGroupMembership: false,
            view: true,
            mapRoles: false,
            impersonate: false,
            manage: false,
          },
        },
        {
          id: '27d09ux9-328e-418c-qd3f-3eb80995f1a5',
          createdTimestamp: 1617669141274,
          username: 'test2',
          enabled: true,
          totp: false,
          emailVerified: true,
          firstName: 'Test2',
          lastName: 'User',
          email: 'test2.user@test.email',
          disableableCredentialTypes: [],
          requiredActions: [],
          notBefore: 0,
          access: {
            manageGroupMembership: false,
            view: true,
            mapRoles: false,
            impersonate: false,
            manage: false,
          },
        },
      ]

      beforeEach(() => {
        //@ts-ignore
        axios.mockImplementation(routes => {
          if (routes.url === userListUrl) {
            return Promise.resolve({
              status: 200,
              data: userListResponse,
            })
          } else if (routes.url === keyCloakServiceTokenUrl) {
            return Promise.resolve({
              status: 200,
              data: keyCloakServiceTokenResp,
            })
          } else {
            return Promise.resolve({
              status: 200,
            })
          }
        })
      })

      it('allows access to route', async () => {
        const response = await request(app.callback()).get('/games').send()

        expect(response.status).toBe(200)
        expect(response.text).toBe('games!')
      })

      it('gets other users to play', async () => {
        const response = await request(app.callback()).get('/users').send()

        expect(response.status).toBe(200)
        expect(response.body).toStrictEqual(userListResponse)

        expect(axios).toBeCalledWith(
          expect.objectContaining({
            url: keyCloakServiceTokenUrl,
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
            },
            data: qs.stringify({
              client_id: config.oauthClientId,
              grant_type: 'client_credentials',
              client_secret: config.oauthClientSecret,
            }),
          })
        )
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
