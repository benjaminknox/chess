import { User } from '@types'
import { AuthState } from '@store/auth'
import { StoreonModule } from 'storeon'
import { ConfigsResponse } from '@common'

export type UsersState = {
  Users: Partial<User>[]
}

export interface UsersEvents {
  ['users/resetUsers']: void
  ['users/setUsers']: Partial<User>[]
  ['users/getUsers']: ConfigsResponse
}

interface State extends UsersState, AuthState {}

export const Users: StoreonModule<State, UsersEvents> = store => {
  store.on('@init', state => ({
    ...state,
    Users: [],
  }))

  store.on('users/setUsers', (state, Users: Partial<User>[]) => ({
    ...state,
    Users,
  }))

  store.on('users/getUsers', (state, configs: ConfigsResponse) => {
    fetch(`${configs.values?.apiBasePath}/users`, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${state.Auth.identity?.access_token}`,
      },
    }).then(async (response: any) => {
      store.dispatch('users/setUsers', await response.json())
    })
  })

  store.on('users/resetUsers', state => {
    store.dispatch('users/setUsers', [])
  })
}
