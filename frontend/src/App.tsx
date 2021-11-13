import React from 'react'
import { Route } from 'react-router-dom'
import { ConfigsProvider } from '@common/configs'
import { LoginFormContainer } from '@pages/auth/LoginFormContainer'

export function App() {
  return (
    <>
      <Route exact path={'/login'} component={LoginFormContainer} />
    </>
  )
}
