import * as React from 'react'
import createStore from '@store'
import { Game, User } from '@types'
import { MyGames } from './MyGames'
import { StoreContext } from 'storeon/react'
import { MemoryRouter } from 'react-router-dom'
import { mountWithFetchMocking } from '@testUtils'
import { fakeIdentity } from '@testUtils/fakeIdentity'
import { generateRandomGame } from '@testUtils/generateGamesList'
import { ConfigsResponse, ConfigsProviderForTesting } from '@common'

describe('MyGames', () => {
  beforeEach(() => {
    cy.viewport(800, 800)
    const store = createStore()
    const basePath = 'http://test'
    const websocketBasePath = 'ws://test-url'
    const game: Game<User> = generateRandomGame()
    store.dispatch('auth/setIdentity', fakeIdentity)

    mountWithFetchMocking(
      <MemoryRouter initialEntries={['/my-games']}>
        <ConfigsProviderForTesting
          config={{
            values: {
              apiBasePath: basePath,
              websocketBasePath,
            },
            loading: false,
            failed: false,
          }}
        >
          <StoreContext.Provider value={store}>
            <MyGames />
          </StoreContext.Provider>
        </ConfigsProviderForTesting>
      </MemoryRouter>,
      {
        path: `${basePath}/games`,
        method: 'GET',
        responseData: [game],
        headers: {
          'Content-type': 'application/json',
          Authorization: `Bearer ${fakeIdentity.access_token}`,
        },
      }
    )
  })

  it('should show my games list', () => {
    cy.get('[data-cy=my-games-title]').should('exist')
  })

  it('should contain pagination', () => {
    cy.get('[data-cy=pagination]').should('exist')
  })
})
