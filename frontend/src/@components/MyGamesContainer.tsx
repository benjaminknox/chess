import { MyGames } from './MyGames'
import { Game, User } from '@types'
import { useConfigs } from '@common'
import { useStoreon } from 'storeon/react'
import React, { useEffect, useState } from 'react'

export function MyGamesContainer() {
  const configs = useConfigs()
  const { Auth } = useStoreon('Auth')
  const [games, setGames] = useState<Game<User>[]>([])

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
  }, [configs.values])

  return <MyGames games={games} />
}
