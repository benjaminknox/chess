import * as React from 'react'
import { useQuery } from '@hooks'
import { Fab } from '@mui/material'
import { Grid } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

export const Pagination = () => {
  const navigate = useNavigate()
  const query = useQuery()

  const handlePagination = (increment: number) => {
    const currentPage = Number(query.get('page') ?? 0)
    const page = `${currentPage + increment}`
    navigate({
      search: "?" + new URLSearchParams({page}).toString()
    })
  }

  return (
    <Grid data-cy='pagination' justifyContent="space-between" container>
      <Fab color='primary' data-cy='pagination-prev' onClick={() => handlePagination(-1)}>
        <ArrowBackIcon />
      </Fab>
      <Fab color='primary' data-cy='pagination-next' onClick={() => handlePagination(1)}>
        <ArrowForwardIcon />
      </Fab>
    </Grid>
  )
}
