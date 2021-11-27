import { Home } from './Home'
import * as React from 'react'
import { mount } from '@cypress/react'

describe('Home', () => {
  beforeEach(() => {
    mount(<Home />)
  })

  it('should show start a new game button', () => {
    cy.get('[data-cy="start-a-new-game"]').should('exist')
  })
  it('should show continue your game button', () => {
    cy.get('[data-cy="continue-your-game"]').should('exist')
  })
})
