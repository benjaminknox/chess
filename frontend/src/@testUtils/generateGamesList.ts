import { generateRandomUser } from './generateUsersList'
import { Game } from '@types'
import mongoid from 'mongoid-js'
import { v4 as uuidv4 } from 'uuid'

export const generateRandomGame = (PassedInGame: Partial<Game> = {}): Game => ({
  _id: mongoid(),
  id: uuidv4(),
  white_player: generateRandomUser(),
  black_player: generateRandomUser(),
  moves: [],
  created_at: new Date(+new Date() - Math.floor(Math.random() * 10000000000)).toString(),
  updated_at: new Date(+new Date() - Math.floor(Math.random() * 10000000000)).toString(),
  __v: 12,
  ...PassedInGame,
})

export const generateGamesList = (): Game[] =>
  Array.from({ length: 15 }, (_, i) => generateRandomGame())
