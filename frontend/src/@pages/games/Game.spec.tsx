import { Game } from './Game'
import * as React from 'react'
import createStore from '@store'
import { mount } from '@cypress/react'
import { StoreContext } from 'storeon/react'
import { MemoryRouter } from 'react-router-dom'
import { fakeIdentity } from '@testUtils/fakeIdentity'

describe('Game', () => {
  it('should show game board', () => {
    cy.viewport(800, 800)
    const store = createStore()
    store.dispatch('auth/setIdentity', fakeIdentity)

    mount(
      <MemoryRouter initialEntries={['/game/test-game-id']}>
        <StoreContext.Provider value={store}>
          <Game />
        </StoreContext.Provider>
      </MemoryRouter>
    )
    cy.get('[data-square] [draggable]').should('have.length', 32)
  })
})
