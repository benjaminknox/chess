import Chess from 'chess.js'
import { useConfigs } from '@common'
import { useStoreon } from 'storeon/react'
import { b } from '@api/common/bodyParamsParser'
import React, { useState, useEffect } from 'react'
import { PlayerCardContainer, Board } from '@components'
import useWebSocket, { ReadyState } from 'react-use-websocket'

export interface BoardContainerProps {
  gameId: string
}

export function BoardContainer({ gameId }: BoardContainerProps) {
  const configs = useConfigs()
  const { dispatch, Auth } = useStoreon('Auth')
  const [game, setGame] = useState<any>(undefined)
  const [board, setChess] = useState<typeof Chess>(new Chess())

  const [gameSocketUri, setGameSocketUri] = useState<string>('wss://echo.websocket.org')
  const { lastMessage } = useWebSocket(gameSocketUri)

  useEffect(() => {
    if (lastMessage) setChess(new Chess(lastMessage.data))
  }, [lastMessage])

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

      setGameSocketUri(`${configs.values.websocketBasePath}/games/${gameId}`)
    }
  }, [configs.values, Auth.identity.access_token])

  const validMove = (piece: string) =>
    game[piece[0] === 'b' ? 'black_player' : 'white_player'] ===
    Auth.decodedAccessToken.sub

  const move = (sourceSquare: string, targetSquare: string, piece: string) => {
    if (!validMove(piece)) return false

    const move = board.move({ from: sourceSquare, to: targetSquare })

    if (configs.values) {
      fetch(`${configs.values.apiBasePath}/games/${gameId}/move`, {
        method: 'POST',
        body: b({
          move: board.fen(),
        }),
        headers: {
          Authorization: `Bearer ${Auth.identity.access_token}`,
          'Content-type': 'application/json',
        },
      })

      setChess(new Chess(board.fen()))
    }

    return move
  }

  return (
    <Board
      whitePlayer={
        game && <PlayerCardContainer userId={game.white_player} align='right' />
      }
      blackPlayer={
        game && <PlayerCardContainer userId={game.black_player} align='left' />
      }
      chess={board}
      move={move}
    />
  )
}
