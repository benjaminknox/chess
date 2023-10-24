import Color from 'color'
import React  from 'react'
import { Chess } from 'chess.js'
import { Game, User } from '@types'
import { colorScheme } from '@common'
import { useStoreon } from 'storeon/react'
import { useNavigate } from 'react-router-dom'
import {
  Typography,
  Paper,
  Fab,
  Table,
  TableRow,
  TableCell,
  TableHead,
} from '@mui/material'

interface MyGamesProps {
  games: Game<User>[]
}

const indicator = {
  '&, &:hover, &:focus': {
    boxShadow: 'none',
  },
  cursor: 'default',
  minWidth: '80px',
  paddingRight: '10px',
  paddingLeft: '10px',
}

const whiteIndicator = {
  ...indicator,
  ...{
    '&, &:hover': {
      background: 'white',
      border: `1px solid ${Color(colorScheme.darkest).lighten(0.5).hex()}`,
    },
  },
}

const blackIndicator = {
  ...indicator,
  ...{
    '&, &:hover': {
      background: colorScheme.darkest,
      color: colorScheme.lightest,
    },
  },
}

const GameRow = ({ game }: { game: Game<User> }) => {
  const navigate = useNavigate()
  const { Auth } = useStoreon('Auth')

  const opponent =
    game.white_player.id === Auth.decodedAccessToken.sub
      ? game.black_player
      : game.white_player

  let white = true
  const moves = game.moves

  if (moves.length > 0) {
    const lastMove = moves[moves.length - 1]
    console.log('lastMove', lastMove)
    const chessGame = new Chess(lastMove.move)
    white = chessGame.turn() === 'w'
  }

  const playerWhosTurnItIs = game[white ? 'white_player' : 'black_player']
  const value = playerWhosTurnItIs.id === Auth.decodedAccessToken.sub ? 'Yours' : 'Theirs'

  return (
    <TableRow
      sx={{
        cursor: 'pointer',
        '&:hover': {
          background: Color('white').darken(0.05).hex(),
        },
        '&:last-of-type .cell': {
          borderBottom: 'none',
        },
      }}
      data-cy={`game`}
      data-cy-id={`game-${game.id}`}
      onClick={() => navigate(`/game/${game.id}`)}
    >
      <TableCell className={'cell'}>
        <Fab
          sx={white ? whiteIndicator : blackIndicator}
          size='small'
          variant='extended'
          disableRipple
          disableFocusRipple
          data-cy={`game-opponent-${opponent.id}`}
        >
          {opponent.firstName}
        </Fab>
      </TableCell>
      <TableCell data-cy='next-move' className='cell'>
        {value}
      </TableCell>
    </TableRow>
  )
}

const cellHeader = { color: Color('white').darken(0.46).hex() }

export function MyGames({ games }: MyGamesProps) {
  return (
    <Paper sx={{ padding: '20px' }} data-cy='my-games'>
      <Typography component='h1' data-cy='my-games-title'>
        My Games
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={cellHeader}>Opponent</TableCell>
            <TableCell sx={cellHeader}>Next Move</TableCell>
          </TableRow>
        </TableHead>
        {games.map(game => (
          <GameRow key={game.id} game={game} />
        ))}
      </Table>
    </Paper>
  )
}
