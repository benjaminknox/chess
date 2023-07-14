import { Game } from '@types'
import * as React from 'react'
import createStore from '@store'
import { mount } from '@cypress/react'
import { MyGames } from '@components/MyGames'
import { fakeIdentity } from '@testUtils/fakeIdentity'
import { generateGamesList } from '@testUtils/generateGamesList'

describe('MyGames', () => {
  const store = createStore()

  let games: Game[] = generateGamesList()

  beforeEach(() => {
    games = generateGamesList()
  })

  it('shows list of games', () => {
    mount(<MyGames games={games} />)

    cy.get('[data-cy=game]').should('have.length', games.length)
  })

  it('shows my games title', () => {
    mount(<MyGames games={games} />)

    cy.get('[data-cy=my-games-title]').contains('My Games')
  })

  it.skip('shows my games title', () => {
    const game = games[0]
    mount(<MyGames games={games} />)

    cy.get(`[data-cy=game-opponent-${game.id}]`).contains('My Games')
  })

})
