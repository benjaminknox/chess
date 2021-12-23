import Color from 'color'
import * as React from 'react'
import { Space } from '@components'
import { colorScheme } from '@common'
import { makeStyles } from '@mui/styles'
import { Grid, Fab } from '@mui/material'
import { useParams } from 'react-router-dom'

const useStyles = makeStyles({
  button: {
    width: '168px',
    fontWeight: 'bold',
  },
  blackButton: {
    background: colorScheme.darkest,
    color: colorScheme.lightest,
    '&:hover': {
      background: Color(colorScheme.darkest).lighten(0.3).hex(),
    },
  },
  whiteButton: {
    background: '#FFFFFF',
    color: colorScheme.darkest,
    '&:hover': {
      background: '#EFEFEF',
    },
  },
})

export function SelectSide() {
  const classes = useStyles()
  const { uid } = useParams() as { uid: string }

  return (
    <Grid data-cy='select-opponent'>
      <Grid item>
        <Fab
          className={`${classes.button} ${classes.blackButton}`}
          variant='extended'
          data-cy='black-player'
        >
          Play as Black
        </Fab>
      </Grid>
      <Space size={24} />
      <Grid item>
        <Fab
          className={`${classes.button} ${classes.whiteButton}`}
          variant='extended'
          data-cy='white-player'
        >
          Play as White
        </Fab>
      </Grid>
    </Grid>
  )
}
