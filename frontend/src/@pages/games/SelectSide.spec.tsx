import * as React from 'react'
import createStore from '@store'
import { SelectSide } from '@pages'
import { mount } from '@cypress/react'
import { StoreContext } from 'storeon/react'
import { SinonStub } from 'cypress/types/sinon'
import { b } from '@api/common/bodyParamsParser'
import { mountWithFetchMocking } from '@testUtils'
import { ProtectedRoute } from '@auth/ProtectedRoute'
import { fakeIdentity } from '@testUtils/fakeIdentity'
import { MemoryRouter, Route, RouteProps } from 'react-router-dom'
import { decodedFakeAccessToken } from '@testUtils/fakeAccessToken'
import { ConfigsResponse, ConfigsProviderForTesting } from '@common'

describe('SelectSide', () => {
  let store: any
  const basePath = 'http://test'
  const opponent = 'test-user-uuid'
  let testLocation: Location | any = {}
  let fetchMock: Cypress.Agent<SinonStub>
  const testGameId = '26de07da-37eb-4ca5-a9b4-2c90bbc7fd1b'

  beforeEach(() => {
    store = createStore()
    store.dispatch('auth/setIdentity', fakeIdentity)

    fetchMock = mountWithFetchMocking(
      <TestSelectSide />,
      {
        path: `${basePath}/games`,
        method: 'POST',
        responseData: {
          _id: '61c5001c2a249c577b24a068',
          white_player: decodedFakeAccessToken.sub,
          black_player: opponent,
          moves: [],
          id: testGameId,
          __v: 0,
        },
        inputData: {
          white_player: decodedFakeAccessToken.sub,
          black_player: opponent,
        },
        headers: {
          'Content-type': 'application/json',
          Authorization: `Bearer ${fakeIdentity.access_token}`,
        },
      },
      {
        path: `${basePath}/games`,
        method: 'POST',
        responseData: {
          _id: '61c5001c2a249c577b24a068',
          white_player: opponent,
          black_player: decodedFakeAccessToken.sub,
          moves: [],
          id: testGameId,
          __v: 0,
        },
        inputData: {
          white_player: opponent,
          black_player: decodedFakeAccessToken.sub,
        },
        headers: {
          'Content-type': 'application/json',
          Authorization: `Bearer ${fakeIdentity.access_token}`,
        },
      }
    )
  })

  it('should show black player button', () => {
    cy.get('[data-cy=black-player]').should('exist')
  })

  it('should show white player button', () => {
    cy.get('[data-cy=white-player]').should('exist')
  })

  describe('when selecting a color', () => {
    it('should send user to a game board', () => {
      cy.get('[data-cy=white-player]')
        .click()
        .then(() => {
          // @ts-ignore
          expect(testLocation.pathname).to.equal(`/game/${testGameId}`)
        })
    })

    it('should start a game with current user as white', () => {
      cy.get('[data-cy=white-player]')
        .click()
        .then(() => {
          //@ts-ignore
          expect(fetchMock).to.be.calledWithMatch(`${basePath}/games`, {
            body: b({
              white_player: decodedFakeAccessToken.sub,
              black_player: opponent,
            }),
          })
        })
    })

    it('should start a game with current user as black', () => {
      cy.get('[data-cy=black-player]')
        .click()
        .then(() => {
          //@ts-ignore
          expect(fetchMock).to.be.calledWithMatch(`${basePath}/games`, {
            body: b({
              white_player: opponent,
              black_player: decodedFakeAccessToken.sub,
            }),
          })
        })
    })
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
