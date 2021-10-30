import { useConfigs } from '@common'
import { LoginForm } from '@pages/auth'
import React, { useState } from 'react'
import { b } from '@api/common/bodyParamsParser'

export function LoginFormContainer() {
  const configs = useConfigs()

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
      }).finally(() => {
        setLoading(false)
      }).catch(() => {
        setSubmitFailed("Couldn't sign in, try again.")
      })
    }
  }

  return <LoginForm onSubmit={onSubmit} loading={loading} submitFailed={submitFailed} />
}
