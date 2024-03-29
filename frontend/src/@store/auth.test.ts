import { Auth } from './auth'
import { createStoreon } from 'storeon'
import { StoreState, StoreEvents } from '.'
import { fetchMocking } from '@testUtils/fetchMocking'
import { fakeIdentity } from '@testUtils/fakeIdentity'
import fakeAccessToken, { decodedFakeAccessToken } from '@testUtils/fakeAccessToken'

describe('Auth Store', () => {
  let store: any

  const identityResponse = fakeIdentity

  const dispatchToken = () => {
    store.dispatch('auth/setIdentity', identityResponse)
  }

  beforeEach(() => {
    store = createStoreon<StoreState, StoreEvents>([Auth])
  })

  afterEach(() => {
    store.dispatch('auth/resetIdentity')
  })

  describe('when updating access token', () => {
    let dateNowSpy: any
    beforeEach(() => {
      dateNowSpy = jest.spyOn(Date, 'now').mockImplementation(() => 0)
      dispatchToken()
    })

    afterEach(() => {
      dateNowSpy.mockRestore()
    })

    it('sets authenticated to true', () => {
      //@ts-ignore
      expect(store.get().Auth.isAuthenticated).toBe(true)
    })

    it('sets access token expiration date', () => {
      //@ts-ignore
      expect(store.get().Auth.session.sessionExpiration).toBe(5000000)
    })

    it('sets decoded access token', () => {
      setTimeout(() => {
        //@ts-ignore
        expect(store.get().Auth.decodedAcessToken).toBe(decodedFakeAccessToken)
      })
    })

    it('sets refresh token expiration date', () => {
      //@ts-ignore
      expect(store.get().Auth.session.refreshTokenExpiration).toBe(6000000)
    })

    describe('when resetting session', () => {
      it('resets session', () => {
        dispatchToken()
        store.dispatch('auth/resetIdentity')
        //@ts-ignore
        expect(store.get().Auth.session).toStrictEqual({})
        //@ts-ignore
        expect(store.get().Auth.isAuthenticated).toBe(false)
      })
    })

    describe('when refreshing token', () => {
      it('refreshes session', () => {
        const responseData = {
          scope: 'test-scope',
          id_token: 'test-id-token',
          expires_in: 8000,
          token_type: 'Bearer',
          access_token: fakeAccessToken,
          refresh_token: 'test-refresh-token',
          session_state: 'test-sessions-state-id',
          refresh_expires_in: 7000,
          ['not-before-policy']: 0,
        }

        const apiBasePath = 'http://test'

        const stub = fetchMocking({
          path: `${apiBasePath}/api/jwt/refresh`,
          method: 'POST',
          inputData: {
            token: identityResponse.refresh_token,
          },
          responseData,
          headers: {
            'Content-type': 'application/json',
          },
        })

        store.dispatch('auth/refreshIdentity', { values: { apiBasePath } })

        setTimeout(() => {
          //@ts-ignore
          expect(store.get().Auth.session.refreshTokenExpiration).toBe(7000000)
          //@ts-ignore
          expect(store.get().Auth.session.sessionExpiration).toBe(8000000)
          //@ts-ignore
          expect(stub).toHaveBeenCalled()
        })
      })
    })
  })
})
