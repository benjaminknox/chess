import { User } from '@types'
import { Space } from '@components'
import { useConfigs } from '@common'
import { makeStyles } from '@mui/styles'
import { SelectUser } from '@components'
import { Grid, Fab } from '@mui/material'
import { useStoreon } from 'storeon/react'
import ForwardIcon from '@mui/icons-material/Forward'
import React, { useState, useEffect } from 'react'

const useStyles = makeStyles({
  center: {
    textAlign: 'center',
  },
  selectUser: {
    minWidth: '446px',
  },
  fabForwardIcon: {
    opacity: 0.8,
  },
})

export interface SelectUserContainerProps {
  selectOpponent: (user: User) => void
}

export function SelectUserContainer({ selectOpponent }: SelectUserContainerProps) {
  const classes = useStyles()
  const configs = useConfigs()
  const { dispatch, Users } = useStoreon('Users')
  const [userList, setUserList] = useState<Partial<User>[]>([])
  const [selectedUser, setSelectedUser] = useState<Partial<User>>({})

  useEffect(() => {
    if (configs.values) {
      dispatch('users/getUsers', configs)
    }
  }, [configs])

  useEffect(() => {
    setUserList(Users)
  }, [Users])

  const updateUser = (user: Partial<User>) => setSelectedUser(user)
  const startGame = () => {
    if (selectedUser) {
      selectOpponent(selectedUser as User)
    }
  }

  return (
    <Grid>
      <Grid item>
        <SelectUser
          className={classes.selectUser}
          userList={userList}
          updateUser={updateUser}
        />
      </Grid>
      <Space size={94} />
      <Grid item className={classes.center}>
        <Fab color='primary' data-cy='user-list-submit' onClick={startGame}>
          <ForwardIcon className={classes.fabForwardIcon} />
        </Fab>
      </Grid>
    </Grid>
  )
}
