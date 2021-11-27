import { createStoreon } from 'storeon'
import { ApiState, ApiEvents, Api } from './api'
import { persistState } from '@storeon/localstorage'
import { AuthState, AuthEvents, Auth } from './auth'
import { UsersState, UsersEvents, Users } from './users'

export interface StoreState extends ApiState, AuthState, UsersState {}

export interface StoreEvents extends ApiEvents, AuthEvents, UsersEvents {}

export * from './auth'
export * from './users'

export default function createStore() {
  return createStoreon<StoreState, StoreEvents>([
    Api,
    Auth,
    Users,
    persistState(['Auth']),
  ])
}
