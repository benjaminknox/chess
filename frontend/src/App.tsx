import React from 'react'
import { Route } from 'react-router-dom'
import { Grid } from '@mui/material'
import { ProtectedRoute } from '@auth/ProtectedRoute'
import { LoginFormContainer } from '@pages/auth/LoginFormContainer'

export function App() {
  return (
    <Grid justifyContent='center' display='flex' alignItems='center' style={{ height: '100%' }}>
      <Route exact path={'/login'} component={LoginFormContainer} />
      <ProtectedRoute exact path={'/'} component={() => <>Home</>} />
    </Grid>
  )
}
