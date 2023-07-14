import { MyGames } from './MyGames'
import { useConfigs } from '@common'
import { useStoreon } from 'storeon/react'
import { Game } from '@types'
import React, { useEffect, useState } from 'react'

export function MyGamesContainer() {
  const configs = useConfigs()
  const { dispatch, Auth } = useStoreon('Auth')
  const [games, setGames] = useState<Game[]>([])

  useEffect(() => {
    if (configs.values) {
      fetch(`${configs.values?.apiBasePath}/games`, {
        method: 'GET',
        headers: {
          'Content-type': 'application/json',
          Authorization: `Bearer ${Auth.identity?.access_token}`,
        },
      })
        .then(response => response.json())
        .then(data => setGames(data))
    }
  }, [])

  return <MyGames games={games} />
}
