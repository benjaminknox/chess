import React, { ReactNode } from 'react'
import { Grid, IconButton } from '@mui/material'
import AppsIcon from '@mui/icons-material/Apps'

export interface LayoutProps {
  children: ReactNode
}

const classes = {
  layout: {
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btn: {
    '& svg': {
      fontSize: '48px',
    },
  },
  nav: {
    width: '100%',
    justifyContent: 'right',
  },
  content: {
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
}

export function Layout({ children }: LayoutProps) {
  return (
    <Grid display='flex' direction='column' sx={classes.layout}>
      <Grid item display='flex' sx={classes.nav} data-cy=''>
        <IconButton aria-label='menu' sx={classes.btn} data-cy='menu-button'>
          <AppsIcon fontSize='inherit' />
        </IconButton>
      </Grid>
      <Grid item display='flex' sx={classes.content}>
        {children}
      </Grid>
    </Grid>
  )
}
