import { StoreonModule } from 'storeon'

export interface AuthState {
  identity: {}
}

export interface AuthEvents {
  ['api/setIdentity']: {}
}

export const Api: StoreonModule<AuthState, AuthEvents> = store => {
  store.on('@init', () => ({ }))
  store.on('api/setIdentity', (state, identity: {}) => {
    return {
      ...state,
      identity,
    }
  })
}
