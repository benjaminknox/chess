import React from 'react'
import Chess from 'chess.js'
import { MoveInfo } from '@components'
import { makeStyles } from '@mui/styles'
import { Chessboard } from 'react-chessboard'

export interface BoardProps {
  chess: typeof Chess
  move: (sourceSquare: string, targetSquare: string, piece: string) => boolean
}

const useStyles = makeStyles({
  turnIndicator: {
    position: 'absolute',
    top: '8px',
    left: '8px',
  },
})

export function Board({ chess, move }: BoardProps) {
  const classes = useStyles()

  return (
    <>
      <div className={classes.turnIndicator}>
        <MoveInfo board={chess} />
      </div>
      <Chessboard position={chess.fen()} onPieceDrop={move} />
    </>
  )
}
