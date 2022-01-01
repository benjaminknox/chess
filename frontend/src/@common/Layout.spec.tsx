import * as React from 'react'
import { Layout } from './Layout'
import { mount } from '@cypress/react'

describe('Layout', () => {
  beforeEach(() => {
    mount(
      <Layout>
        <div data-cy='site-content'>test</div>
      </Layout>
    )
  })
  it('should show the content', () => {
    cy.get('[data-cy=site-content]')
  })
  it('should show the menu icon', () => {
    cy.get('[data-cy=menu-button]')
  })
})
