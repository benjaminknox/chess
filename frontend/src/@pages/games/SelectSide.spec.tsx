import * as React from 'react'
import createStore from '@store'
import { SelectSide } from '@pages'
import { mount } from '@cypress/react'
import { StoreContext } from 'storeon/react'
import { MemoryRouter } from 'react-router-dom'
import { ProtectedRoute } from '@auth/ProtectedRoute'
import { fakeIdentity } from '@testUtils/fakeIdentity'
import { ConfigsResponse, ConfigsProviderForTesting } from '@common'

describe('SelectSide', () => {
  let store: any
  const basePath = 'http://test'
  const opponent = 'test-user-uuid'

  beforeEach(() => {
    store = createStore()
    store.dispatch('auth/setIdentity', fakeIdentity)

    mount(<TestSelectSide />)
  })

  it('should show black player button', () => {
    cy.get('[data-cy=black-player]').should('exist')
  })

  it('should show white player button', () => {
    cy.get('[data-cy=white-player]').should('exist')
  })

  const TestSelectSide = (config: Partial<ConfigsResponse>) => {
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
      <MemoryRouter initialEntries={[`/new-game/${opponent}/select-side`]}>
        <StoreContext.Provider value={store}>
          <ConfigsProviderForTesting config={configsForUse}>
            <ProtectedRoute
              exact
              path={'/new-game/:uid/select-side'}
              component={SelectSide}
            />
          </ConfigsProviderForTesting>
        </StoreContext.Provider>
      </MemoryRouter>
    )
  }
})
