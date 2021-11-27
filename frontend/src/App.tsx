import React from 'react'
import { Grid } from '@mui/material'
import { Route } from 'react-router-dom'
import { useStoreon } from 'storeon/react'
import { Redirect } from 'react-router-dom'
import { Home, SelectOpponent } from '@pages'
import { ProtectedRoute } from '@auth/ProtectedRoute'
import { LoginFormContainer } from '@pages/auth/LoginFormContainer'

export function App() {
  const { dispatch, Auth } = useStoreon('Auth')

  return (
    <Grid
      justifyContent='center'
      display='flex'
      alignItems='center'
      style={{ height: '100%' }}
    >
      <ProtectedRoute exact path={'/'} component={Home} />
      <ProtectedRoute
        exact
        path={'/new-game/select-opponent'}
        component={SelectOpponent}
      />
      <ProtectedRoute
        exact
        path={'/logout'}
        component={() => {
          dispatch('auth/resetIdentity')
          return <Redirect to='/login' />
        }}
      />
      <Route exact path={'/login'} component={LoginFormContainer} />
    </Grid>
  )
}
