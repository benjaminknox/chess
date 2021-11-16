import * as React from 'react'
import { useConfigs } from '@common'
import { useStoreon } from 'storeon/react'
import { Redirect, Route } from 'react-router-dom'

export function ProtectedRoute({ component: Component, ...restOfProps }: any) {
  const configs = useConfigs()
  const { dispatch, Auth } = useStoreon('Auth')

  if (Auth.session.sessionExpiration < Date.now() - 300 && configs) {
    dispatch('auth/refreshIdentity', configs)
  }

  if (
    Auth.session.sessionExpiration < Date.now() &&
    Auth.session.refreshTokenExpiration < Date.now()
  ) {
    dispatch('auth/resetIdentity')
    return <Redirect to='/login' />
  }

  return (
    <Route
      {...restOfProps}
      render={props =>
        Auth.isAuthenticated ? <Component {...props} /> : <Redirect to='/login' />
      }
    />
  )
}
