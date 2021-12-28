import * as React from 'react'
import { useParams } from 'react-router-dom'
import { BoardContainer } from '@components/BoardContainer'

export function Game() {
  const { id } = useParams() as { id: string }

  return <BoardContainer />
}
