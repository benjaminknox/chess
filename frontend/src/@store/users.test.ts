import { User } from '@types'
import { Auth } from './auth'
import { Users } from './users'
import { createStoreon } from 'storeon'
import { StoreState, StoreEvents } from '.'
import { fakeIdentity } from '@testUtils/fakeIdentity'
import { fetchMocking } from '@testUtils/fetchMocking'
import { generateUsersList } from '@testUtils/generateUsersList'

describe('Users Store', () => {
  let store: any
  let testUserList: Partial<User>[]

  beforeEach(() => {
    store = createStoreon<StoreState, StoreEvents>([Users, Auth])
    testUserList = generateUsersList()
    store.dispatch('auth/setIdentity', fakeIdentity)
  })

  afterEach(() => {
    store.dispatch('auth/resetIdentity')
    store.dispatch('users/resetUsers')
  })

  describe('when populating a user list', () => {
    it('sets the user list', () => {
      store.dispatch('users/setUsers', testUserList)
      //@ts-ignore
      expect(store.get().Users).toStrictEqual(testUserList)
    })

    it('sets user list from request', () => {
      const apiBasePath = 'http://test'

      const stub = fetchMocking({
        path: `${apiBasePath}/users`,
        method: 'GET',
        responseData: testUserList,
        headers: {
          'Content-type': 'application/json',
          Authorization: `Bearer ${fakeIdentity.access_token}`,
        },
      })

      store.dispatch('users/getUsers', { values: { apiBasePath } })

      setTimeout(() => {
        //@ts-ignore
        expect(store.get().Users).toStrictEqual(testUserList)
        //@ts-ignore
        expect(stub).toHaveBeenCalled()
      })
    })

    it('resets the user list', () => {
      store.dispatch('users/setUsers', testUserList)
      store.dispatch('users/resetUsers')
      //@ts-ignore
      expect(store.get().Users).toStrictEqual([])
    })
  })
})
