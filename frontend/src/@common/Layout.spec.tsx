import * as React from 'react'
import { Layout } from './Layout'
import { mount } from '@cypress/react'
import { MemoryRouter, Route, RouteProps } from 'react-router-dom'

describe('Layout', () => {
  let testLocation: Location | any = {}
  beforeEach(() => {
    mount(
      <MemoryRouter initialEntries={['/']}>
        <Layout>
          <div data-cy='site-content'>test</div>
        </Layout>
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
  it('should show the content', () => {
    cy.get('[data-cy=site-content]').should('exist')
  })

  describe('notifications icon', () => {
    it('should show in the page', () => {
      cy.get('[data-cy=notifications-button]').should('exist')
    })
  })

  describe('menu icon', () => {
    it('should show in the page', () => {
      cy.get('[data-cy=menu-button]').should('exist')
    })

    it('should have a tooltip', () => {
      cy.get('[data-cy=menu-button]').realHover()
      cy.get('[id=menu-button-tooltip]').should('be.visible').contains('menu')
    })

    describe('when menu is opened', () => {
      it('should show mui drawer', () => {
        cy.get('[data-cy=menu-button]').click()
        cy.get('[data-cy=menu-drawer]').should('be.visible')
      })
      it('should hide mui drawer when it is closed', () => {
        cy.get('[data-cy=menu-button]').click()
        cy.get('[data-cy=menu-drawer]').click().should('not.exist')
      })
      it('should logout when logout button is clicked', () => {
        cy.get('[data-cy=menu-button]').click()
        cy.get('[data-cy=logout-button]')
          .click()
          .then(() => {
            // @ts-ignore
            expect(testLocation.pathname).to.equal(`/logout`)
          })
      })
      it('should show the my-games page', () => {
        cy.get('[data-cy=menu-button]').click()
        cy.get('[data-cy=my-games-button]')
          .click()
          .then(() => {
            // @ts-ignore
            expect(testLocation.pathname).to.equal(`/my-games`)
          })
      })
    })
  })
})
