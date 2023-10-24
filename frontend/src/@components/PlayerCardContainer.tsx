import { Align } from '@types'
import { useConfigs } from '@common'
import React, { useEffect, useState } from 'react'
import { PlayerCard } from './PlayerCard'
import { useStoreon } from 'storeon/react'

export interface PlayerCardContainerProps {
  userId: string
  align: Align
}

export function PlayerCardContainer({ userId, align }: PlayerCardContainerProps) {
  const configs = useConfigs()
  const { Auth } = useStoreon('Auth')
  const [name, setName] = useState<string>('')
  const [me, setMe] = useState<boolean>(false)

  useEffect(() => {
    if (configs.values) {
      fetch(`${configs.values?.apiBasePath}/users/${userId}`, {
        method: 'GET',
        headers: {
          'Content-type': 'application/json',
          Authorization: `Bearer ${Auth.identity?.access_token}`,
        },
      })
        .then(response => response.json())
        .then(data => {
          setMe(Auth.decodedAccessToken.sub === userId)
          setName(data.username)
        })
    }
  }, [configs.values, Auth.identity.access_token, Auth.decodedAccessToken.sub, userId])

  return <PlayerCard me={me} name={name} align={align} />
}
