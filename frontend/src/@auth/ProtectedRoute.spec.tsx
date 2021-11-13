import * as React from 'react'
import { mount } from '@cypress/react'
import { ProtectedRoute } from './ProtectedRoute'
import { MemoryRouter, Route, RouteProps } from 'react-router-dom'

describe('ProtectedRoute', () => {
  describe('when user is not logged in', () => {
    it('redirects to login page', () => {
      let testLocation: Location | any = {}

      mount(
        <MemoryRouter initialEntries={['/']} initialIndex={1}>
          <ProtectedRoute component={() => <>Unprotected Route</>} />
          <Route
            path='*'
            render={({ location }: RouteProps) => {
              testLocation = location
              return <div data-cy='test'></div>
            }}
          />
        </MemoryRouter>
      )

      cy.get('[data-cy=test]').then(() => {
        // @ts-ignore
        expect(testLocation.pathname).to.equal('/login')
      })
    })
  })
})
