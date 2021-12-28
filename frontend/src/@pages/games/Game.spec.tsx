import { Game } from './Game'
import * as React from 'react'
import { mount } from '@cypress/react'
import { MemoryRouter } from 'react-router-dom'

describe('Game', () => {
  it('should show game board', () => {
    cy.viewport(800, 800)
    mount(
      <MemoryRouter initialEntries={['/game/test-game-id']}>
        <Game />
      </MemoryRouter>
    )
    cy.get('[data-square] [draggable]').should('have.length', 32)
  })
})
