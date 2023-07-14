import * as React from 'react'
import createStore from '@store'
import { mount } from '@cypress/react'
import { Server } from 'mock-websocket'
import { StoreContext } from 'storeon/react'
import { SinonStub } from 'cypress/types/sinon'
import { BrowserRouter } from 'react-router-dom'
import { BoardContainer } from './BoardContainer'
import { fakeIdentity } from '@testUtils/fakeIdentity'
import { decodedFakeAccessToken } from '@testUtils/fakeAccessToken'
import { ConfigsResponse, ConfigsProviderForTesting } from '@common'
import { mountWithFetchMocking, generateRandomUser } from '@testUtils'

describe('Board', () => {
  let store: any
  const basePath = 'https://test-id'
  let websocketBasePath: string
  let fetchStub: Cypress.Agent<SinonStub>
  const game: {
    _id: string
    white_player: string
    black_player: string
    moves: { move: string; move_number: number }[]
    id: string
    __v: number
  } = {
    _id: '_test-record-id',
    white_player: decodedFakeAccessToken.sub,
    black_player: 'black-player-id',
    moves: [],
    id: '',
    __v: 0,
  }

  const setGameId = (gameId: string = 'test-game-id') => {
    game.id = gameId
  }

  const whitePlayer = {
    ...generateRandomUser(),
    id: game.white_player,
  }

  const blackPlayer = {
    ...generateRandomUser(),
    id: game.black_player,
  }

  const userFechMocks = [
    {
      path: `${basePath}/users/${whitePlayer.id}`,
      method: 'GET',
      responseData: whitePlayer,
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${fakeIdentity.access_token}`,
      },
    },
    {
      path: `${basePath}/users/${blackPlayer.id}`,
      method: 'GET',
      responseData: blackPlayer,
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${fakeIdentity.access_token}`,
      },
    },
  ]

  let mockServer: Server

  beforeEach(() => {
    cy.viewport(800, 800)

    websocketBasePath = `ws://test-url`

    mockServer = new Server(`${websocketBasePath}/games/${game.id}`)

    store = createStore()

    store.dispatch('auth/setIdentity', fakeIdentity)
  })

  describe('when loading board for the first time', () => {
    beforeEach(() => {
      setGameId()
      const testMove1 = 'rnbqkbnr/pppppppp/8/8/8/6P1/PPPPPP1P/RNBQKBNR b KQkq - 0 1'
      const testMove2 = 'rnbqkbnr/pppp1ppp/4p3/8/8/6P1/PPPPPP1P/RNBQKBNR w KQkq - 0 2'

      fetchStub = mountWithFetchMocking(
        <TestBoardContainer />,
        {
          path: `${basePath}/games/${game.id}`,
          method: 'GET',
          responseData: game,
          headers: {
            'Content-type': 'application/json',
            Authorization: `Bearer ${fakeIdentity.access_token}`,
          },
        },
        {
          path: `${basePath}/games/${game.id}/move`,
          method: 'POST',
          inputData: { move: testMove1 },
          responseData: { ...game, moves: [{ move: testMove1, id: 2 }] },
          headers: {
            'Content-type': 'application/json',
            Authorization: `Bearer ${fakeIdentity.access_token}`,
          },
        },
        {
          path: `${basePath}/games/${game.id}/move`,
          method: 'POST',
          inputData: { move: testMove2 },
          responseData: { ...game, moves: [{ move: testMove1, id: 2 }] },
          headers: {
            'Content-type': 'application/json',
            Authorization: `Bearer ${fakeIdentity.access_token}`,
          },
        },
        ...userFechMocks
      )
    })

    it('should show board in start position', () => {
      cy.get('[data-square] [draggable]').should('have.length', 32)
      //@ts-ignore
      expect(fetchStub).to.be.calledThrice
    })

    describe('when the move is valid', () => {
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

        cy.get('[data-square=g3] div[draggable=true]').should('exist')
      })
    })

    describe('when the move is invalid', () => {
      it('should not allow the board when black player moves white', () => {
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

        cy.get('[data-square=e7] div[draggable=true]').then($draggable => {
          cy.get('[data-square=e6]').then($droppable => {
            const dataTransfer = { dataTransfer: new DataTransfer() }

            cy.wrap($draggable).trigger('dragstart', dataTransfer)
            cy.wrap($droppable)
              .trigger('drop', dataTransfer)
              .trigger('mouseup', { force: true })
          })
        })

        cy.get('div[data-square=e6] [draggable]').should('not.exist')
      })
    })
  })

  describe('when loading an existing board', () => {
    beforeEach(() => {
      setGameId()
      fetchStub = mountWithFetchMocking(
        <TestBoardContainer />,
        {
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
        },
        ...userFechMocks
      )
    })

    it('should load the last turn taken', () => {
      cy.get('[data-square] [draggable]').should('have.length', 30)
      cy.get('div[data-square=e5] [draggable]').should('exist')
    })

    it('should load the last turn taken', () => {
      cy.get('[data-square] [draggable]').should('have.length', 30)
      cy.get('div[data-square=e5] [draggable]').should('exist')
    })

    it('should move the board when the other player moves', () => {
      mockServer.send('8/8/K7/8/6k1/8/8/8 w - - 0 1')

      cy.get('[data-square] [draggable]').should('have.length', 2)
    })

    it('should show the user avatars', () => {
      cy.get('[data-cy=avatar-left]').contains(blackPlayer.username)
      cy.get('[data-cy=avatar-right]').contains('me')
    })
  })

  describe('when loading an the last game', () => {
    const returnedGameId = 'the-returned-game-id'
    const move = 'rnbqkbnr/pp3ppp/8/3pp3/8/5PP1/PPPPK2P/RNBQ1BNR b kq - 0 5'

    beforeEach(() => {
      setGameId('latest')
      fetchStub = mountWithFetchMocking(
        <TestBoardContainer />,
        {
          path: `${basePath}/games/${game.id}`,
          method: 'GET',
          responseData: {
            ...game,
            id: returnedGameId,
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
        },
        {
          path: `${basePath}/games/${returnedGameId}/move`,
          method: 'POST',
          inputData: { move },
          responseData: { ...game, moves: [{ move, id: 2 }] },
          headers: {
            'Content-type': 'application/json',
            Authorization: `Bearer ${fakeIdentity.access_token}`,
          },
        },
        ...userFechMocks
      )
    })

    it('should call move with returned game id', () => {
        cy.get('[data-square=g2] div[draggable=true]').then($draggable => {
          cy.get('[data-square=g3]').then($droppable => {
            const dataTransfer = { dataTransfer: new DataTransfer() }

            cy.wrap($draggable).trigger('dragstart', dataTransfer)
            cy.wrap($droppable)
              .trigger('drop', dataTransfer)
              .trigger('mouseup', { force: true })

          })
        })

      cy.get('[data-square=f3] div[draggable=true]').should('exist')
        .then(() => {
          //@ts-ignore
          expect(fetchStub).to.be.calledWithMatch(returnedGameId)
        })

    })
  })

  function TestBoardContainer(config: Partial<ConfigsResponse>) {
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
            <BoardContainer gameId={game.id} />
          </ConfigsProviderForTesting>
        </StoreContext.Provider>
      </BrowserRouter>
    )
  }
})
