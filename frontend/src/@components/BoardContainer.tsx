import { Chess } from 'chess.js'
import { useConfigs } from '@common'
import { useStoreon } from 'storeon/react'
import { Game } from '@types'
import { b } from '@api/common/bodyParamsParser'
import React, { useState, useEffect } from 'react'
import { PlayerCardContainer, Board } from '@components'
import useWebSocket from 'react-use-websocket'

export interface BoardContainerProps {
  gameId: string
}

export function BoardContainer({ gameId }: BoardContainerProps) {
  const configs = useConfigs()
  const { Auth } = useStoreon('Auth')
  const [game, setGame] = useState<Game<string>>()
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
        .then(async (body: Game<string>) => {
          setGame(body)
          if (body.moves.length > 0) {
            setChess(new Chess(body.moves[body.moves.length - 1].move))
          }

          if (configs.values)
            setGameSocketUri(`${configs.values.websocketBasePath}/games/${body.id}`)
        })
    }
  }, [configs.values, Auth.identity.access_token])

  const validMove = (piece: string) =>
    game && game[piece[0] === 'b' ? 'black_player' : 'white_player'] ===
    Auth.decodedAccessToken.sub

  const move = (sourceSquare: string, targetSquare: string, piece: string) => {
    if (!game || !validMove(piece)) return false

    const move = board.move({ from: sourceSquare, to: targetSquare })

    if (configs.values) {
      fetch(`${configs.values.apiBasePath}/games/${game.id}/move`, {
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
