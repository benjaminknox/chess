import { User } from './User'

export interface Move {
  move: string; move_number: number
}

export interface Game {
  _id: string
  white_player: User
  black_player: User
  moves: Move[]
  created_at: string,
  updated_at: string,
  id: string
  __v: number
}
