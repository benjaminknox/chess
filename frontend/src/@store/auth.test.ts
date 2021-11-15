import { Auth } from './auth'
import { createStoreon } from 'storeon'
import { StoreState, StoreEvents } from '.'

describe('Auth Store', () => {
  describe('when updating access token', () => {
    let dateNowSpy: any
    let store: any

    beforeEach(() => {
      dateNowSpy = jest.spyOn(Date, 'now').mockImplementation(() => 0)
      store = createStoreon<StoreState, StoreEvents>([Auth])
      store.dispatch('auth/setIdentity', {
        scope: 'test-scope',
        id_token: 'test-id-token',
        expires_in: 5000,
        token_type: 'Bearer',
        access_token: 'test-access-token',
        refresh_token: 'test-refresh-token',
        session_state: 'test-sessions-state-id',
        refresh_expires_in: 6000,
        ['not-before-policy']: 0,
      })
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

    it('sets refresh token expiration date', () => {
      //@ts-ignore
      expect(store.get().Auth.session.refreshTokenExpiration).toBe(6000000)
    })
  })
})
