import { StoreonModule } from 'storeon'

interface IdentityProps {
  scope: string
  id_token: string
  expires_in: number
  token_type: string
  access_token: string
  refresh_token: string
  session_state: string
  refresh_expires_in: number
  ['not-before-policy']: number
}

export interface AuthState {
  Auth: {
    identity?: IdentityProps
    isAuthenticated: boolean
    session: {
      sessionExpiration?: number
      refreshTokenExpiration?: number
    }
  }
}

export interface AuthEvents {
  ['auth/setIdentity']: IdentityProps
  ['auth/resetIdentity']: void
}

export const Auth: StoreonModule<AuthState, AuthEvents> = store => {
  store.on('@init', state => {
    return {
      ...state,
      Auth: {
        isAuthenticated: false,
        session: {},
      },
    }
  })

  store.on('auth/setIdentity', (state, identity: IdentityProps) => {
    return {
      ...state,
      Auth: {
        identity,
        isAuthenticated: true,
        session: {
          sessionExpiration: Date.now() + identity.expires_in * 1000,
          refreshTokenExpiration: Date.now() + identity.refresh_expires_in * 1000,
        },
      },
    }
  })

  store.on('auth/resetIdentity', state => ({
    ...state,
    Auth: {
      identity: undefined,
      isAuthenticated: false,
      session: {},
    },
  }))
}
