import React from 'react'
import Chess from 'chess.js'
import { Chessboard } from 'react-chessboard'

export interface BoardProps {
  chess: typeof Chess
  move: (sourceSquare: string, targetSquare: string, piece: string) => boolean
}

export function Board({ chess, move }: BoardProps) {
  return <Chessboard position={chess.fen()} onPieceDrop={move} />
}
