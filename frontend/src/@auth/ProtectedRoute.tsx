import * as React from 'react'
import { Redirect, Route } from 'react-router-dom'

export function ProtectedRoute({
  component: Component,
  ...restOfProps
}: any) {
  const isAuthenticated = localStorage.getItem('isAuthenticated')

  return (
    <Route
      {...restOfProps}
      render={props =>
        isAuthenticated ? <Component {...props} /> : <Redirect to='/login' />
      }
    />
  )
}
