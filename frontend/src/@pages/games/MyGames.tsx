import * as React from 'react'
import { Pagination } from '@common'
import { useParams } from 'react-router-dom'
import { MyGamesContainer } from '@components/MyGamesContainer'
import { Grid } from '@mui/material'

export function MyGames() {
  return (
    <Grid container spacing={4}>
      <Grid item xs={12}>
        <MyGamesContainer />
      </Grid>
      <Grid item xs={12}>
        <Pagination />
      </Grid>
    </Grid>
  )
}
