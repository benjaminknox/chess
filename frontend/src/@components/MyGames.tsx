import { useConfigs } from '@common'
import { Paper } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useStoreon } from 'storeon/react'
import { Game } from '@types'

interface MyGamesProps {
  games: Game[]
}

export function MyGames({ games }: MyGamesProps) {
  return (
    <>
      <h1 data-cy='my-games-title'>My Games</h1>
      <Paper data-cy='my-games'>
        {games.map((game, i) => (
          <div data-cy='game'>game {i}</div>
        ))}
      </Paper>
    </>
  )
}
