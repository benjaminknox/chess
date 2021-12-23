import * as React from 'react'
import { useHistory } from 'react-router-dom'
import { SelectUserContainer } from '@components'

export function SelectOpponent() {
  const history = useHistory()

  return (
    <SelectUserContainer
      selectOpponent={user => {
        history.push(`/new-game/${user.id}/select-side`)
      }}
    />
  )
}
