import React from 'react'
import { Route } from 'react-router-dom'
import { Grid } from '@mui/material'
import { ProtectedRoute } from '@auth/ProtectedRoute'
import { LoginFormContainer } from '@pages/auth/LoginFormContainer'

export function App() {
  return (
    <Grid
      justifyContent='center'
      display='flex'
      alignItems='center'
      style={{ height: '100%' }}
    >
      <ProtectedRoute exact path={'/'} component={() => <div data-cy='home'>Home</div>} />
      <Route exact path={'/login'} component={LoginFormContainer} />
    </Grid>
  )
}
