import * as React from 'react'
import { Pagination } from '@common'
import { mount } from '@cypress/react'
import { MemoryRouter, Route, RouteProps } from 'react-router-dom'

describe('Pagination', () => {
  let testLocation: Location | any = {}
  const initialRoute = '/my-game'

  beforeEach(() => {
    mount(
      <MemoryRouter initialEntries={[initialRoute]}>
        <Pagination />
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

  it('contain a pagination element', () => {
    cy.get('[data-cy=pagination]').should('exist')
  })

  it('contain a next button', () => {
    cy.get('[data-cy=pagination-next]').should('exist')
  })

  it('contain a previous button', () => {
    cy.get('[data-cy=pagination-prev]').should('exist')
  })

  it('should have page query string param equal to 2', () => {
    cy.get('[data-cy=pagination-next]')
      .click()
      .click()
      .then(() => {
        // @ts-ignore
        expect(testLocation.search).to.equal('?page=2')
      })
  })

  it('should have page query string param equal to 1', () => {
    cy.get('[data-cy=pagination-next]')
      .click()
      .click()

    cy.get('[data-cy=pagination-prev]')
      .click()
      .then(() => {
        // @ts-ignore
        expect(testLocation.search).to.equal('?page=1')
      })
  })
})
