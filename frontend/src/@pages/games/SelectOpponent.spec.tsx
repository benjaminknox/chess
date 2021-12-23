import { User } from '@types'
import * as React from 'react'
import createStore from '@store'
import { mount } from '@cypress/react'
import { StoreContext } from 'storeon/react'
import { SelectOpponent } from './SelectOpponent'
import { fakeIdentity } from '@testUtils/fakeIdentity'
import { MemoryRouter, Route, RouteProps } from 'react-router-dom'
import { ConfigsResponse, ConfigsProviderForTesting } from '@common'
import { mountWithFetchMocking, generateUsersList } from '@testUtils'

describe('SelectOpponent', () => {
  let store: any
  let fetchMock: any
  const basePath = 'http://test'
  let testLocation: Location | any = {}

  const testUserList: Partial<User>[] = generateUsersList()
  const opponent = testUserList[2].id

  beforeEach(() => {
    store = createStore()
    store.dispatch('auth/setIdentity', fakeIdentity)

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

  describe('when a user is selected', () => {
    it('should move to next route', () => {
      cy.get('[data-cy=user-list-select]').click()
      cy.get('[data-cy=user-2]').click()
      cy.get('[data-cy=user-list-submit]')
        .click()
        .then(() => {
          // @ts-ignore
          expect(testLocation.pathname).to.equal(`/new-game/${opponent}/select-side`)
        })
    })
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
      <MemoryRouter initialEntries={['/select-opponent']}>
        <StoreContext.Provider value={store}>
          <ConfigsProviderForTesting config={configsForUse}>
            <SelectOpponent />
          </ConfigsProviderForTesting>
          <Route
            path='*'
            render={({ location }: RouteProps) => {
              testLocation = location
              return <div data-cy='test'></div>
            }}
          />
        </StoreContext.Provider>
      </MemoryRouter>
    )
  }
})
