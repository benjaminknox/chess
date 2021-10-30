import * as React from 'react'
import { mount } from '@cypress/react'
import { Space } from './Space'

describe('LoginForm', () => {
  it('shows the login form elements', () => {
    const height = 20
    mount(<Space size={height} />)
    cy.get('[data-cy="size"]').should('exist')
    cy.get('[data-cy="size"]').should('have.css', 'height', '20px')
  })
})
