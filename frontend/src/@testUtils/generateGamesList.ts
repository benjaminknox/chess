import Chess from 'chess.js'
import { generateRandomUser } from './generateUsersList'
import { Game } from '@types'
import mongoid from 'mongoid-js'
import { v4 as uuidv4 } from 'uuid'

export const generateRandomGame = (
  PassedInGame: Partial<Game> = {},
  whitePlayerId?: string,
  blackPlayerId?: string
): Game => {
  const game = new Chess()

  const moves = Array.from(
    { length: Math.floor(Math.random() * (30 - 4 + 1)) + 4 },
    (_: undefined, i: number) => {
      const moves = game.moves()
      const move = moves[Math.floor(Math.random() * moves.length)]
      game.move(move)
      return { move: game.fen().toString(), move_number: i + 1 }
    }
  )

  return {
    _id: mongoid(),
    id: uuidv4(),
    white_player: generateRandomUser({ id: whitePlayerId }),
    black_player: generateRandomUser({ id: blackPlayerId }),
    moves,
    created_at: new Date(
      +new Date() - Math.floor(Math.random() * 10000000000)
    ).toString(),
    updated_at: new Date(
      +new Date() - Math.floor(Math.random() * 10000000000)
    ).toString(),
    __v: 12,
    ...PassedInGame,
  }
}

export const generateGamesList = (PassedInGame: Partial<Game> = {}): Game[] =>
  Array.from({ length: 15 }, () => generateRandomGame(PassedInGame))

export const generateGamesListForPassedInUser = (id: string): Game[] =>
  Array.from({ length: 15 }, () => {
    const determiner = Math.random() < 0.5

    const white_player = determiner ? id : undefined
    const black_player = determiner ? undefined : id

    return generateRandomGame({}, white_player, black_player)
  })
