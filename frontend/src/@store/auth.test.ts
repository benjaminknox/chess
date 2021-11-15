import { Auth } from './auth'
import { createStoreon } from 'storeon'
import { StoreState, StoreEvents } from '.'

describe('Auth Store', () => {
  it('sets authenticated to true', () => {
    const store = createStoreon<StoreState, StoreEvents>([Auth])
    store.dispatch('auth/setIdentity', {
      scope: "test-scope",
      id_token: "test-id-token",
      expires_in: 5000,
      token_type: "Bearer",
      access_token: "test-access-token",
      refresh_token: "test-refresh-token",
      session_state: "test-sessions-state-id",
      refresh_expires_in: 5000,
      ['not-before-policy']: 0
    })

    expect(store.get().Auth.isAuthenticated).toBe(true)
  })
})
