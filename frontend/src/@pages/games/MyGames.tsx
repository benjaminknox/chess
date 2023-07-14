import * as React from 'react'
import { Pagination } from '@common'
import { useParams } from 'react-router-dom'
import { MyGamesContainer } from '@components/MyGamesContainer'

export function MyGames() {
  return (
    <>
      <MyGamesContainer />
      <Pagination />
    </>
  )
}
