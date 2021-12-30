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
  const [game, setGame] = useState<any>(undefined)

  useEffect(() => {
    if (configs.values) {
      fetch(`${configs.values.apiBasePath}/games/${gameId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${Auth.identity.access_token}`,
          'Content-type': 'application/json',
        },
      })
        .then(async response => response.json())
        .then(async (body: any) => {
          setGame(body)
          if (body.moves.length > 0) {
            setChess(new Chess(body.moves[body.moves.length - 1].move))
          }
        })
    }
  }, [configs.values])

  const validMove = (piece: string) =>
    game[piece[0] === 'b' ? 'black_player' : 'white_player'] ===
    Auth.decodedAccessToken.sub

  const move = (sourceSquare: string, targetSquare: string, piece: string) => {
    if (!validMove(piece)) return false

    const move = chess.move({ from: sourceSquare, to: targetSquare })

    if (configs.values) {
      fetch(`${configs.values.apiBasePath}/games/${gameId}/move`, {
        method: 'POST',
        body: b({
          move: chess.fen(),
        }),
        headers: {
          Authorization: `Bearer ${Auth.identity.access_token}`,
          'Content-type': 'application/json',
        },
      })

      setChess(new Chess(chess.fen()))
    }

    return move
  }

  return <Board chess={chess} move={move} />
}
