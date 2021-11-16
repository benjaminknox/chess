import { App } from './App'
import * as React from 'react'
import createStoreon from '@store'
import { mount } from '@cypress/react'
import { StoreContext } from 'storeon/react'
import { SinonStub } from 'cypress/types/sinon'
import { MemoryRouter, Route, RouteProps } from 'react-router-dom'

describe('App', () => {
  const store = createStoreon()
  let testLocation: Location | any = {}

  beforeEach(() => {
    testLocation = {}
  })

  const TestApp = ({ startPath = '/login' }) => (
    <StoreContext.Provider value={store}>
      <MemoryRouter initialEntries={[startPath]} initialIndex={1}>
        <App />
        <Route
          path='*'
          render={({ location }: RouteProps) => {
            testLocation = location
            return <div data-cy='test'></div>
          }}
        />
      </MemoryRouter>
    </StoreContext.Provider>
  )

  describe('when not logged in', () => {
    it('redirects to login page', () => {
      mount(<TestApp />)

      cy.get('[data-cy=test]').then(() => {
        // @ts-ignore
        expect(testLocation.pathname).to.equal('/login')
      })
    })
  })

  describe('when logged in', () => {
    let dateNowStub: SinonStub
    beforeEach(() => {
      dateNowStub = cy.stub(Date, 'now').callsFake(() => 0)

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
    })

    afterEach(() => {
      dateNowStub.restore()
    })

    it('redirects login to home page', () => {
      mount(<TestApp />)

      cy.get('[data-cy=home]').then(() => {
        // @ts-ignore
        expect(testLocation.pathname).to.equal('/')
      })
    })

    it('should be logged out', () => {
      dateNowStub.restore()

      mount(<TestApp />)

      cy.get('[data-cy=test]').then(() => {
        // @ts-ignore
        expect(testLocation.pathname).to.equal('/login')
      })
    })

    describe('when going to logut route', () => {
      it('should log out', () => {
        expect(store.get().Auth.isAuthenticated).to.equal(true)

        mount(<TestApp startPath={'/logout'} />)

        cy.get('[data-cy=test]').then(() => {
          // @ts-ignore
          expect(testLocation.pathname).to.equal('/login')
          // @ts-ignore
          expect(store.get().Auth.isAuthenticated).to.equal(false)
        })
      })
    })
  })
})
