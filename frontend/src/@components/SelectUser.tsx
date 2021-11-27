import { User } from '@types'
import React, { useState } from 'react'
import { makeStyles } from '@mui/styles'
import {
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  SelectChangeEvent,
} from '@mui/material'

const useStyles = makeStyles({
  userSelect: {
    background: '#FFF',
  },
})

export interface SelectUserProps {
  className?: string
  userList: Partial<User>[]
  updateUser: (user: Partial<User>) => void
}

export function SelectUser({ userList, updateUser, className }: SelectUserProps) {
  const classes = useStyles()
  const [userId, setUserId] = useState<string>('')

  const onSelect = (evt: SelectChangeEvent<string>) => {
    const user = userList.find(user => user.id === evt.target.value)
    user && updateUser(user)
    user?.id && setUserId(user.id)
  }

  return (
    <FormControl>
      <InputLabel id='user-list-label'>Select Opponent</InputLabel>
      <Select
        value={userId}
        onChange={onSelect}
        className={`${className} ${classes.userSelect}`}
        label='Select Opponent'
        labelId='user-list-label'
        data-cy='user-list-select'
      >
        {userList.map((user, i) => (
          <MenuItem data-cy={`user-${i}`} key={i} value={user.id}>
            {user.username}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}
