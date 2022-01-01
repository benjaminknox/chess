import * as React from 'react'
import { Space } from '@components'
import { Link } from 'react-router-dom'
import { makeStyles } from '@mui/styles'
import { Grid, Fab } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import ForwardIcon from '@mui/icons-material/Forward'

const useStyles = makeStyles({
  fab: {
    width: '232px',
    color: '#FFF',
    fontWeight: 'bold',
    justifyContent: 'left',
    letterSpacing: '1px',
  },
  fabText: {
    marginTop: '3px',
    marginLeft: '8px',
  },
  fabAddIcon: {
    opacity: 0.5,
  },
  fabForwardIcon: {
    opacity: 0.54,
    fontSize: '12pt',
    marginLeft: '7px',
  },
})

export function Home() {
  const classes = useStyles()

  return (
    <Grid data-cy='home'>
      <Grid item>
        <Fab
          className={classes.fab}
          variant='extended'
          color='primary'
          component={Link}
          to='/new-game/select-opponent'
          data-cy='start-a-new-game'
        >
          <AddIcon className={classes.fabAddIcon} />
          <span className={classes.fabText}>Start a New Game</span>
        </Fab>
      </Grid>
      <Space size={24} />
      <Grid item>
        <Fab
          className={classes.fab}
          variant='extended'
          color='secondary'
          component={Link}
          to='/game/latest'
          data-cy='continue-your-game'
        >
          <ForwardIcon className={classes.fabForwardIcon} />
          <span className={classes.fabText}>Continue Your Game</span>
        </Fab>
      </Grid>
    </Grid>
  )
}
