import * as React from 'react'
import { useNavigate } from 'react-router-dom'
import { SelectUserContainer } from '@components'

export function SelectOpponent() {
  const navigate = useNavigate()

  return (
    <SelectUserContainer
      selectOpponent={user => {
        navigate(`/new-game/${user.id}/select-side`)
      }}
    />
  )
}
