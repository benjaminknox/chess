import * as React from 'react'
import { SelectUserContainer } from '@components'

export function SelectOpponent() {
  return <SelectUserContainer selectOpponent={(user) => { console.log(user)}} />
}
