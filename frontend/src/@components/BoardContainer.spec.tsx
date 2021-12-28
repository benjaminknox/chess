import * as React from 'react'
import { mount } from '@cypress/react'
import { BoardContainer } from './BoardContainer'

describe('Board', () => {
  beforeEach(() => {
    cy.viewport(800, 800)
    mount(<TestBoardContainer />)
  })

  it('shows board in start position', () => {
    cy.get('[data-square] [draggable]').should('have.length', 32)
  })

  it('updates the board after move', () => {
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

  function TestBoardContainer() {
    return <BoardContainer />
  }
})
