import Chess from 'chess.js'
import { Game } from '@types'
import * as React from 'react'
import createStore from '@store'
import { mount } from '@cypress/react'
import { StoreContext } from 'storeon/react'
import { MyGames } from '@components/MyGames'
import { fakeIdentity } from '@testUtils/fakeIdentity'
import { MemoryRouter, Route, RouteProps } from 'react-router-dom'
import { decodedFakeAccessToken } from '@testUtils/fakeAccessToken'
import {
  generateGamesList,
  generateGamesListForPassedInUser,
} from '@testUtils/generateGamesList'

describe('MyGames', () => {
  const store = createStore()
  let testLocation: Location | any = {}
  const initialRoute = '/my-game'

  let games: Game[]

  beforeEach(() => {
    store.dispatch('auth/setIdentity', fakeIdentity)
    games = generateGamesListForPassedInUser(decodedFakeAccessToken.sub)

    mount(
      <MemoryRouter initialEntries={[initialRoute]}>
        <StoreContext.Provider value={store}>
          <MyGames games={games} />
        </StoreContext.Provider>
        <Route
          path='*'
          render={({ location }: RouteProps) => {
            testLocation = location
            return <div data-cy='test'></div>
          }}
        />
      </MemoryRouter>
    )
  })

  it('shows list of games', () => {
    cy.get('[data-cy=game]').should('have.length', games.length)
  })

  it('shows my games title', () => {
    cy.get('[data-cy=my-games-title]').contains('My Games')
  })

  it('shows my games title', () => {
    const opponentId =
      games[0].white_player.id === decodedFakeAccessToken.sub
        ? games[0].black_player.id
        : games[0].white_player.id

    cy.get(`[data-cy=game-opponent-${opponentId}]`).should('exist')
  })

  it("shows who's turn it is", () => {
    const game = games[0]
    const moves = game.moves
    const lastMove = moves[moves.length - 1]
    const chessGame = new Chess(lastMove.move)
    const playerWhosTurnItIs =
      game[chessGame.turn() === 'w' ? 'white_player' : 'black_player']

    const value =
      playerWhosTurnItIs.id === decodedFakeAccessToken.sub ? 'Yours' : 'Theirs'

    cy.get('[data-cy=next-move]').first().contains(value)
  })

  it("goes to the game on row click", () => {
    const game = games[0]

    cy.get(`[data-cy-id=game-${game.id}]`)
      .click()
      .then(() => {
        console.log(testLocation)
        // @ts-ignore
        expect(testLocation.pathname).to.equal(`/game/${game.id}`)
      })
  })
})
