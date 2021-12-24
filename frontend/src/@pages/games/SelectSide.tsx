import Color from 'color'
import * as React from 'react'
import { Space } from '@components'
import { side } from '@common/types'
import { makeStyles } from '@mui/styles'
import { Grid, Fab } from '@mui/material'
import { useStoreon } from 'storeon/react'
import { b } from '@api/common/bodyParamsParser'
import { colorScheme, useConfigs } from '@common'
import { useParams, useHistory } from 'react-router-dom'

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
  const configs = useConfigs()
  const history = useHistory()
  const { dispatch, Auth } = useStoreon('Auth')
  const { uid } = useParams() as { uid: string }

  const startGame = (selectedSide: string) => {
    if (configs.values) {
      const white_player = selectedSide === side.white ? Auth.decodedAccessToken.sub : uid
      const black_player = selectedSide === side.black ? Auth.decodedAccessToken.sub : uid

      fetch(`${configs.values.apiBasePath}/games`, {
        method: 'POST',
        body: b({
          white_player,
          black_player,
        }),
        headers: {
          Authorization: `Bearer ${Auth.identity.access_token}`,
          'Content-type': 'application/json',
        },
      })
        .then((response: any) => response.json())
        .then((body: any) => history.push(`/game/${body.id}`))
    }
  }

  return (
    <Grid data-cy='select-opponent'>
      <Grid item>
        <Fab
          variant='extended'
          data-cy='black-player'
          onClick={() => startGame(side.black)}
          className={`${classes.button} ${classes.blackButton}`}
        >
          Play as Black
        </Fab>
      </Grid>
      <Space size={24} />
      <Grid item>
        <Fab
          variant='extended'
          data-cy='white-player'
          onClick={() => startGame(side.white)}
          className={`${classes.button} ${classes.whiteButton}`}
        >
          Play as White
        </Fab>
      </Grid>
    </Grid>
  )
}
