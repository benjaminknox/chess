import Chess from 'chess.js'
import { Board } from './Board'
import React, { useState } from 'react'

export function BoardContainer() {
  const [chess, setChess] = useState<typeof Chess>(new Chess())

  const move = (sourceSquare: string, targetSquare: string, piece: string) => {
    const move = chess.move({ from: sourceSquare, to: targetSquare })

    setChess(new Chess(chess.fen()))

    return move
  }

  return <Board chess={chess} move={move} />
}
