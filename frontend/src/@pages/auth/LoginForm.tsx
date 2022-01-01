import { Space } from '@components'
import React, { useState } from 'react'
import { LoadingButton } from '@mui/lab'
import { Alert, Grid, Paper, TextField, Typography } from '@mui/material'

const classes = {
  loginWrapper: {
    padding: '10px',
    maxWidth: '300px',
  },
}

export interface LoginFormProps {
  loading?: boolean
  emailFailed?: string
  submitFailed?: string
  passwordFailed?: string
  onSubmit: (username: string, password: string) => void
}

export function LoginForm({
  loading,
  onSubmit,
  emailFailed,
  submitFailed,
  passwordFailed,
}: LoginFormProps) {
  const [username, setUsername] = useState<string>('')
  const [password, setPassword] = useState<string>('')

  const sendLoginForm = () => onSubmit(username, password)

  const renderSubmitFailed = function () {
    if (submitFailed) {
      return (
        <>
          <Space size={20} />
          <Grid item xs>
            <Alert severity='error' data-cy='login-form-error'>
              {submitFailed}
            </Alert>
          </Grid>
        </>
      )
    }
  }

  return (
    <form>
      <Grid
        container
        direction='column'
        alignItems='center'
        sx={classes.loginWrapper}
        data-cy='login-form-wrapper'
        component={Paper}
        spacing={1}
      >
        <Grid item xs data-cy='login-form-header'>
          <Typography variant='h6'>Welcome To Chess</Typography>
        </Grid>
        <Space size={20} />
        <Grid item xs>
          <TextField
            data-cy='login-form-email'
            error={!!emailFailed}
            helperText={emailFailed && emailFailed}
            label='email'
            value={username}
            onChange={evt => setUsername(evt.target.value)}
          />
        </Grid>
        <Grid item xs>
          <TextField
            data-cy='login-form-password'
            error={!!passwordFailed}
            helperText={passwordFailed && passwordFailed}
            type='password'
            label='password'
            value={password}
            onChange={evt => setPassword(evt.target.value)}
          />
        </Grid>
        {renderSubmitFailed()}
        <Space size={20} />
        <Grid item xs>
          <LoadingButton
            type='submit'
            loading={loading}
            variant='contained'
            data-cy='login-form-submit'
            disableElevation
            onClick={() => {
              sendLoginForm()
            }}
          >
            Sign in
          </LoadingButton>
        </Grid>
        <Space size={20} />
      </Grid>
    </form>
  )
}
