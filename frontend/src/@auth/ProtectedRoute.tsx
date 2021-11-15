import * as React from 'react'
import { useStoreon } from 'storeon/react'
import { Redirect, Route } from 'react-router-dom'

export function ProtectedRoute({
  component: Component,
  ...restOfProps
}: any) {
  const { dispatch, Auth } = useStoreon('Auth')

  return (
    <Route
      {...restOfProps}
      render={props =>
        Auth.isAuthenticated ? <Component {...props} /> : <Redirect to='/login' />
      }
    />
  )
}
