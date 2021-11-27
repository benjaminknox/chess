import { User } from '@types'
import * as React from 'react'
import createStore from '@store'
import { StoreContext } from 'storeon/react'
import { BrowserRouter } from 'react-router-dom'
import { fakeIdentity } from '@testUtils/fakeIdentity'
import { SelectUserContainer } from './SelectUserContainer'
import { ConfigsResponse, ConfigsProviderForTesting } from '@common'
import { mountWithFetchMocking, generateUsersList } from '@testUtils'

describe('SelectUserContiner', () => {
  let store: any
  let fetchMock: any
  const basePath = 'http://test'
  let testUserList: Partial<User>[]

  beforeEach(() => {
    store = createStore()
    store.dispatch('auth/setIdentity', fakeIdentity)

    testUserList = generateUsersList()

    fetchMock = mountWithFetchMocking(<TestSelectUserContainer />, {
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

  it('shows the user list select', () => {
    cy.get('[data-cy=user-list-select]').should('exist')
  })

  it('shows the user next button', () => {
    cy.get('[data-cy=user-list-submit]').should('exist')
  })

  it('gets the users from api', () => {
    cy.get('[data-cy=user-list-select]').click()
    cy.get('[data-cy=user-4]')
      .should('exist')
      .then(() => {
        //@ts-ignore
        expect(fetchMock).to.be.calledOnce
      })
  })

  const TestSelectUserContainer = (config: Partial<ConfigsResponse>) => {
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
      <BrowserRouter>
        <StoreContext.Provider value={store}>
          <ConfigsProviderForTesting config={configsForUse}>
            <SelectUserContainer />
          </ConfigsProviderForTesting>
        </StoreContext.Provider>
      </BrowserRouter>
    )
  }
})
