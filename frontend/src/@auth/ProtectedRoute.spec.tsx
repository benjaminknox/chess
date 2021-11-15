import * as React from 'react'
import { Auth } from '@store/auth'
import { mount } from '@cypress/react'
import { createStoreon } from 'storeon'
import { StoreContext } from 'storeon/react'
import { ProtectedRoute } from './ProtectedRoute'
import { MemoryRouter, Route, RouteProps } from 'react-router-dom'

describe('ProtectedRoute', () => {
  let testLocation: Location | any = {}

  const TestComponent = () => (
    <MemoryRouter initialEntries={['/']} initialIndex={1}>
      <ProtectedRoute
        component={() => <div data-cy='protected-test-route'>Protected Route</div>}
      />
      <Route
        path='*'
        render={({ location }: RouteProps) => {
          testLocation = location
          return <div data-cy='test'></div>
        }}
      />
    </MemoryRouter>
  )

  beforeEach(() => {
    testLocation = {}
  })

  describe('when user is not logged in', () => {
    it('redirects to login page', () => {
      mount(
        <StoreContext.Provider value={createStoreon([Auth])}>
          <TestComponent />
        </StoreContext.Provider>
      )

      cy.get('[data-cy=test]').then(() => {
        // @ts-ignore
        expect(testLocation.pathname).to.equal('/login')
      })
    })
  })
  describe('when user is logged in', () => {
    it('shows protected route', () => {
      const store = createStoreon([Auth])

      store.dispatch('auth/setIdentity', {
        scope: 'test-scope',
        id_token: 'test-id-token',
        expires_in: 5000,
        token_type: 'Bearer',
        access_token: 'test-access-token',
        refresh_token: 'test-refresh-token',
        session_state: 'test-sessions-state-id',
        refresh_expires_in: 5000,
        ['not-before-policy']: 0,
      })

      mount(
        <StoreContext.Provider value={store}>
          <TestComponent />
        </StoreContext.Provider>
      )

      cy.get('[data-cy=protected-test-route]').then(() => {
        // @ts-ignore
        expect(testLocation.pathname).to.equal('/')
      })
    })
  })

  describe('when user session expires', () => {
    describe('when refresh token is expired', () => {
      it('should be logged out', () => {
        const dateNowStub = cy.stub(Date, 'now').callsFake(() => 0)
        const store = createStoreon([Auth])

        store.dispatch('auth/setIdentity', {
          scope: 'test-scope',
          id_token: 'test-id-token',
          expires_in: 5000,
          token_type: 'Bearer',
          access_token: 'test-access-token',
          refresh_token: 'test-refresh-token',
          session_state: 'test-sessions-state-id',
          refresh_expires_in: 5000,
          ['not-before-policy']: 0,
        })

        dateNowStub.restore()

        mount(
          <StoreContext.Provider value={store}>
            <TestComponent />
          </StoreContext.Provider>
        )

        cy.get('[data-cy=test]').then(() => {
          // @ts-ignore
          expect(testLocation.pathname).to.equal('/login')
        })
      })
    })
  })
})
