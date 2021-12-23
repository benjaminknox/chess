import { uuid } from 'uuidv4'
import { GameMove } from 'entities'

import {
  prop,
  plugin,
  Severity,
  modelOptions,
  getModelForClass,
} from '@typegoose/typegoose'

@modelOptions({ options: { allowMixed: Severity.ALLOW } })
export class Game {
  @prop({ default: () => uuid() })
  public id: string

  @prop({ required: true })
  public white_player: string

  @prop({ required: true })
  public black_player: string

  @prop({ required: true })
  public moves: Array<GameMove>
}

export const GameModel = getModelForClass(Game)
