import * as React from 'react'
import { Layout } from '@common'
import { useConfigs } from '@common'
import { useStoreon } from 'storeon/react'
import { Navigate } from 'react-router-dom'

interface ProtectedRouteProps {
  component: React.FC
}

export function ProtectedRoute({ component: Component }: ProtectedRouteProps) {
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
    return <Navigate to='/login' />
  }

  return Auth.isAuthenticated ? (
    <Layout>
      <Component />
    </Layout>
  ) : (
    <Navigate to='/login' />
  )
}
