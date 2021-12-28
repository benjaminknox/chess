import Chess from 'chess.js'
import { Board } from './Board'
import { useConfigs } from '@common'
import { useStoreon } from 'storeon/react'
import { b } from '@api/common/bodyParamsParser'
import React, { useState, useEffect } from 'react'

export interface BoardContainerProps {
  gameId: string
}

export function BoardContainer({ gameId }: BoardContainerProps) {
  const configs = useConfigs()
  const { dispatch, Auth } = useStoreon('Auth')
  const [chess, setChess] = useState<typeof Chess>(new Chess())

  useEffect(() => {
    if (configs.values) {
      fetch(`${configs.values?.apiBasePath}/games/${gameId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${Auth.identity.access_token}`,
          'Content-type': 'application/json',
        },
      })
        .then(async response => response.json())
        .then(async (body: any) => {
          if (body.moves.length > 0) {
            setChess(new Chess(body.moves[0].move))
          }
        })
    }
  }, [])

  const move = (sourceSquare: string, targetSquare: string, piece: string) => {
    const move = chess.move({ from: sourceSquare, to: targetSquare })

    setChess(new Chess(chess.fen()))

    return move
  }

  return <Board chess={chess} move={move} />
}
