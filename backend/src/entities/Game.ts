import { uuid } from 'uuidv4';
import { prop, modelOptions, getModelForClass, DocumentType, Severity } from '@typegoose/typegoose';

@modelOptions({options: {allowMixed: Severity.ALLOW}})
export class Game {
  @prop({ default: () => uuid() })
  public id: string

  @prop({ required: true })
  public white_player: string

  @prop({ required: true })
  public black_player: string

  @prop({ required: true })
  public moves: Array<{
    move: string
    move_number: number
  }>
}

export const GameModel = getModelForClass(Game)
