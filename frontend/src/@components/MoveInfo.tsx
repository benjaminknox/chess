import Color from 'color'
import Chess from 'chess.js'
import * as React from 'react'
import { Fab } from '@mui/material'
import { colorScheme } from '@common'
import { makeStyles } from '@mui/styles'

const useStyles = makeStyles({
  button: {
    '&, &:hover': {
      cursor: 'default',
    },
    width: '168px',
    fontWeight: 'bold',
  },
  blackButton: {
    '&, &:hover': {
      background: colorScheme.darkest,
      color: colorScheme.lightest,
    },
  },
  whiteButton: {
    '&, &:hover': {
      background: '#FFFFFF',
      color: colorScheme.darkest,
    },
  },
})

export interface MoveInfoProps {
  board: typeof Chess
}

export function MoveInfo({ board }: MoveInfoProps) {
  const classes = useStyles()

  const button =
    board.turn() === 'w' ? (
      <Fab
        component='div'
        variant='extended'
        data-cy='white-move'
        className={`${classes.button} ${classes.whiteButton}`}
      >
        {"White's Turn"}
      </Fab>
    ) : (
      <Fab
        component='div'
        variant='extended'
        data-cy='black-move'
        className={`${classes.button} ${classes.blackButton}`}
      >
        {"Black's Turn"}
      </Fab>
    )

  return <>{button}</>
}
