import { createStoreon } from 'storeon'
import { ApiState, ApiEvents, Api } from './api'
import { AuthState, AuthEvents, Auth } from './auth'
import { persistState } from '@storeon/localstorage'

export interface StoreState extends ApiState, AuthState {}

export interface StoreEvents extends ApiEvents, AuthEvents {}

export default function createStore() {
  return createStoreon<StoreState, StoreEvents>([Api, Auth, persistState(['Auth'])])
}
