import { User } from '@types'
import * as React from 'react'
import createStore from '@store'
import { SelectOpponent } from './SelectOpponent'
import { mount } from '@cypress/react'
import { StoreContext } from 'storeon/react'
import { MemoryRouter } from 'react-router-dom'
import { fakeIdentity } from '@testUtils/fakeIdentity'
import { ConfigsResponse, ConfigsProviderForTesting } from '@common'
import { mountWithFetchMocking, generateUsersList } from '@testUtils'

describe('SelectOpponent', () => {
  let store: any
  let fetchMock: any
  const basePath = 'http://test'
  let testUserList: Partial<User>[]

  beforeEach(() => {
    store = createStore()
    store.dispatch('auth/setIdentity', fakeIdentity)

    testUserList = generateUsersList()

    fetchMock = mountWithFetchMocking(<TestSelectOpponent />, {
      path: `${basePath}/users`,
      method: 'GET',
      responseData: testUserList,
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${fakeIdentity.access_token}`,
      },
    })
  })

  afterEach(() => {
    store.dispatch('auth/resetIdentity')
    store.dispatch('users/resetUsers')
  })

  it('should show user select', () => {
    cy.get('[data-cy="user-list-select"]').should('exist')
  })

  const TestSelectOpponent = (config: Partial<ConfigsResponse>) => {
    const defaultConfig: ConfigsResponse = {
      values: { apiBasePath: basePath },
      loading: false,
      failed: false,
    }

    const configsForUse: ConfigsResponse = {
      ...defaultConfig,
      ...config,
    }

    return (
      <MemoryRouter initialEntries={['/new-game']}>
        <StoreContext.Provider value={store}>
          <ConfigsProviderForTesting config={configsForUse}>
            <SelectOpponent />
          </ConfigsProviderForTesting>
        </StoreContext.Provider>
      </MemoryRouter>
    )
  }
})
