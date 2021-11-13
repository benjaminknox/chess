import { App } from './App'
import * as React from 'react'
import { mount } from '@cypress/react'
import { MemoryRouter, Route, RouteProps } from 'react-router-dom'

describe('App', () => {
  describe('when not logged in', () => {
    it('redirects to login page', () => {
      //let testHistory: string[]
      let testLocation: Location | any = {}

      mount(
        <MemoryRouter initialEntries={['/login']} initialIndex={1}>
          <App />
          <Route 
            path='*'
            render={({ location }: RouteProps) => {
            testLocation = location
              return <div data-cy="test"></div>
          }}
          />
        </MemoryRouter>
      )

      cy.get("[data-cy=test]").then(() => {
        // @ts-ignore
        expect(testLocation.pathname).to.equal('/login')
      })
    })
  })
})
