import * as React from 'react'
import createStore from '@store'
import { Game, User } from '@types'
import { mount } from '@cypress/react'
import { StoreContext } from 'storeon/react'
import { SinonStub } from 'cypress/types/sinon'
import { BrowserRouter } from 'react-router-dom'
import { mountWithFetchMocking } from '@testUtils'
import { MyGamesContainer } from './MyGamesContainer'
import { fakeIdentity } from '@testUtils/fakeIdentity'
import { generateRandomGame } from '@testUtils/generateGamesList'
import { decodedFakeAccessToken } from '@testUtils/fakeAccessToken'
import { ConfigsResponse, ConfigsProviderForTesting } from '@common'

describe('MyGamesContainer', () => {
  const store = createStore()
  const basePath = 'http://test'
  const websocketBasePath = 'ws://test-url'
  const game: Game<User> = generateRandomGame({}, decodedFakeAccessToken.sub)

  beforeEach(() => {
    store.dispatch('auth/setIdentity', fakeIdentity)
  })

  it('shows my games', () => {
    const fetchMock = mountWithFetchMocking(<TestMyGamesContainer />, {
      path: `${basePath}/games`,
      method: 'GET',
      responseData: [game],
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${fakeIdentity.access_token}`
      }
    })

    cy.get('[data-cy=my-games]').should('exist')
    cy.get('[data-cy=game]')
      .should('exist')
      .then(() => {
        //@ts-ignore
        expect(fetchMock).to.be.calledOnce
      })
  })

  function TestMyGamesContainer(config: Partial<ConfigsResponse>) {
    const defaultConfig: ConfigsResponse = {
      values: {
        apiBasePath: basePath,
        websocketBasePath,
      },
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
            <MyGamesContainer />
          </ConfigsProviderForTesting>
        </StoreContext.Provider>
      </BrowserRouter>
    )
  }
})
