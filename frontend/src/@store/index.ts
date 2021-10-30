import { createStoreon } from 'storeon'
import { ApiState, ApiEvents, Api } from './api'

export interface StoreState extends ApiState { }

export interface StoreEvents extends ApiEvents { }

export default function createStore() {
  return createStoreon<StoreState, StoreEvents>([Api])
}
