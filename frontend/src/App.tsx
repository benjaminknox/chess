import React from 'react'
import { Grid } from '@mui/material'
import { Route } from 'react-router-dom'
import { useStoreon } from 'storeon/react'
import { Redirect } from 'react-router-dom'
import { ProtectedRoute } from '@auth/ProtectedRoute'
import { Home, SelectOpponent, SelectSide, Game } from '@pages'
import { LoginFormContainer } from '@pages/auth/LoginFormContainer'

export function App() {
  const { dispatch, Auth } = useStoreon('Auth')

  return (
    <>
      <ProtectedRoute exact path={'/'} component={Home} />
      <ProtectedRoute
        exact
        path={'/new-game/select-opponent'}
        component={SelectOpponent}
      />
      <ProtectedRoute exact path={'/game/:id'} component={Game} />
      <ProtectedRoute exact path={'/new-game/:uid/select-side'} component={SelectSide} />
      <ProtectedRoute
        exact
        path={'/logout'}
        component={() => {
          dispatch('auth/resetIdentity')
          return <Redirect to='/login' />
        }}
      />
      <Route exact path={'/login'} component={LoginFormContainer} />
    </>
  )
}
