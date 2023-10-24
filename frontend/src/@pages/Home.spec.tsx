import { Home } from './Home'
import * as React from 'react'
import { mount } from '@cypress/react'
import { MemoryRouter, Route, useLocation } from 'react-router-dom'

describe('Home', () => {
  let testLocation: Location | any = {}

  beforeEach(() => {
    mount(
      <MemoryRouter initialEntries={['/']}>
        <Home />
        <Route
          path='*'
          Component={() => {
            testLocation = useLocation()
            return <div data-cy='test'></div>
          }}
        />
      </MemoryRouter>
    )
  })

  describe('when page loads', () => {
    it('should show start a new game button', () => {
      cy.get('[data-cy="start-a-new-game"]').should('exist')
    })

    it('should show continue your game button', () => {
      cy.get('[data-cy="continue-last-game"]').should('exist')
    })

    describe('when going to the last game started', () => {
      it('should go to the latest game button', () => {
        cy.get('[data-cy="continue-last-game"]')
          .click()
          .then(() => {
            // @ts-ignore
            expect(testLocation.pathname).to.equal(`/game/latest`)
          })
      })
    })
  })
})
