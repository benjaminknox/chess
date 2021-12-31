import * as React from 'react'
import { Align } from '@types'
import { stringToColor } from '@common'
import { makeStyles } from '@mui/styles'
import { Box, Avatar } from '@mui/material'

export interface PlayerCardProps {
  me: boolean
  name: string
  avatarUrl?: string
  align: Align
}

const useStyles = makeStyles({
  wrapper: {
    display: 'flex',
    alignItems: 'center',
    marginTop: '20px',
    marginBottom: '20px',
  },
  ['wrapper-align-left']: {
    flexDirection: 'row',
  },
  ['wrapper-align-right']: {
    flexDirection: 'row-reverse',
  },
  avatar: {
    border: '2px solid rgba(34, 56, 67, 0.5)',
  },
  ['avatar-align-left']: {
    marginRight: '8px',
  },
  ['avatar-align-right']: {
    marginLeft: '8px',
  },
})

export function PlayerCard({ me, name, avatarUrl, align }: PlayerCardProps) {
  const classes = useStyles()

  align = align || 'left'

  return (
    <Box
      data-cy={`avatar-${align}`}
      className={`${classes.wrapper} ${classes[`wrapper-align-${align}`]}`}
    >
      <Avatar
        className={`${classes.avatar} ${classes[`avatar-align-${align}`]}`}
        sx={{ bgcolor: stringToColor(name) }}
      >
        {name && name[0].toUpperCase()}
      </Avatar>
      <div>{me ? 'me' : name}</div>
    </Box>
  )
}
