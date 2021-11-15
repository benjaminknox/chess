import { useConfigs } from '@common'
import { LoginForm } from '@pages/auth'
import React, { useState } from 'react'
import { useStoreon } from 'storeon/react'
import { Redirect } from 'react-router-dom'
import { b } from '@api/common/bodyParamsParser'

export function LoginFormContainer() {
  const configs = useConfigs()

  const { dispatch, Auth } = useStoreon('Auth')
  const [loading, setLoading] = useState<boolean>(false)
  const [submitFailed, setSubmitFailed] = useState<string | undefined>(undefined)

  const onSubmit = (username: string, password: string) => {
    if (configs.values) {
      setLoading(true)
      fetch(`${configs.values.apiBasePath}/api/jwt/login`, {
        method: 'POST',
        body: b({
          auth: btoa(`${username}:${password}`),
        }),
        headers: {
          'Content-type': 'application/json',
        },
      })
        .then(async (response: any) => {
          dispatch('auth/setIdentity', await response.json())
        })
        .finally(() => {
          setLoading(false)
        })
        .catch(() => {
          setSubmitFailed("Couldn't sign in, try again.")
        })
    } else {
      console.warn('Config values not present')
    }
  }

  return Auth.isAuthenticated ? (
    <Redirect to={'/'} />
  ) : (
    <LoginForm onSubmit={onSubmit} loading={loading} submitFailed={submitFailed} />
  )
}
