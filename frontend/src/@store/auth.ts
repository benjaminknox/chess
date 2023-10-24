import jwt_decode from 'jwt-decode'
import { StoreonModule } from 'storeon'
import { ConfigsResponse } from '@common'
import { accessToken } from '@common/types'
import { b } from '@api/common/bodyParamsParser'

export interface IdentityProps {
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

export type AuthState = {
  Auth: {
    decodedAccessToken?: Partial<accessToken>
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
  ['auth/refreshIdentity']: ConfigsResponse
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
        decodedAccessToken: identity.access_token
          ? jwt_decode(identity.access_token)
          : undefined,
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
      decodedAccessToken: undefined,
      identity: undefined,
      isAuthenticated: false,
      session: {},
    },
  }))

  store.on('auth/refreshIdentity', (state, configs: ConfigsResponse) => {
    fetch(`${configs.values?.apiBasePath}/jwt/refresh`, {
      method: 'POST',
      body: b({
        token: state.Auth.identity?.refresh_token,
      }),
      headers: {
        'Content-type': 'application/json',
      },
    }).then(async (response: {json: () => Promise<IdentityProps>}) => {
      store.dispatch('auth/setIdentity', await response.json())
    })
  })
}
