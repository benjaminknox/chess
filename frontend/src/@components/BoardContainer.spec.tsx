import * as React from 'react'
import createStore from '@store'
import { mount } from '@cypress/react'
import { StoreContext } from 'storeon/react'
import { SinonStub } from 'cypress/types/sinon'
import { BrowserRouter } from 'react-router-dom'
import { BoardContainer } from './BoardContainer'
import { mountWithFetchMocking } from '@testUtils'
import { fakeIdentity } from '@testUtils/fakeIdentity'
import { ConfigsResponse, ConfigsProviderForTesting } from '@common'

describe('Board', () => {
  let store: any
  const basePath = 'https://test-id'
  let fetchStub: Cypress.Agent<SinonStub>
  let game: {
    _id: string
    white_player: string
    black_player: string
    moves: { move: string; move_number: number }[]
    id: string
    __v: number
  }

  beforeEach(() => {
    cy.viewport(800, 800)

    game = {
      _id: '_test-record-id',
      white_player: 'white-player-id',
      black_player: 'black-player-id',
      moves: [],
      id: 'test-game-id',
      __v: 0,
    }

    store = createStore()

    store.dispatch('auth/setIdentity', fakeIdentity)
  })

  describe('when loading board for the first time', () => {
    beforeEach(() => {
      fetchStub = mountWithFetchMocking(<TestBoardContainer />, {
        path: `${basePath}/games/${game.id}`,
        method: 'GET',
        responseData: game,
        headers: {
          'Content-type': 'application/json',
          Authorization: `Bearer ${fakeIdentity.access_token}`,
        },
      })
    })

    it('should show board in start position', () => {
      cy.get('[data-square] [draggable]').should('have.length', 32)
      //@ts-ignore
      expect(fetchStub).to.be.calledOnce
    })

    it('should update the board after move', () => {
      cy.get('[data-square] [draggable]').should('have.length', 32)

      cy.get('[data-square=g2] div[draggable=true]').then($draggable => {
        cy.get('[data-square=g3]').then($droppable => {
          const dataTransfer = { dataTransfer: new DataTransfer() }

          cy.wrap($draggable).trigger('dragstart', dataTransfer)
          cy.wrap($droppable)
            .trigger('drop', dataTransfer)
            .trigger('mouseup', { force: true })
        })
      })

      cy.get('div[data-square=g3] [draggable]').should('exist')
    })
  })

  describe('when loading an existing board', () => {
    beforeEach(() => {
      fetchStub = mountWithFetchMocking(<TestBoardContainer />, {
        path: `${basePath}/games/${game.id}`,
        method: 'GET',
        responseData: {
          ...game,
          moves: [
            {
              move: 'rnbqkbnr/pp3ppp/8/3pp3/8/5P2/PPPPK1PP/RNBQ1BNR w kq - 0 5',
              move_number: 3,
            },
          ],
        },
        headers: {
          'Content-type': 'application/json',
          Authorization: `Bearer ${fakeIdentity.access_token}`,
        },
      })
    })

    it('should load the last turn taken', () => {
      cy.get('[data-square] [draggable]').should('have.length', 30)
      cy.get('div[data-square=e5] [draggable]').should('exist')
    })
  })

  function TestBoardContainer(config: Partial<ConfigsResponse>) {
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
            <BoardContainer gameId={game.id} />
          </ConfigsProviderForTesting>
        </StoreContext.Provider>
      </BrowserRouter>
    )
  }
})
