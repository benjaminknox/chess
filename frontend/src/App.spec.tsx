import { App } from './App'
import * as React from 'react'
import createStoreon from '@store'
import { mount } from '@cypress/react'
import { StoreContext } from 'storeon/react'
import { SinonStub } from 'cypress/types/sinon'
import { fakeIdentity } from '@testUtils/fakeIdentity'
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

      store.dispatch('auth/setIdentity', fakeIdentity)
    })

    afterEach(() => {
      dateNowStub.restore()
    })

    describe('when user session is valid', () => {
      beforeEach(() => {
        mount(<TestApp />)
      })

      it('redirects login to home page', () => {
        cy.get('[data-cy=home]').then(() => {
          // @ts-ignore
          expect(testLocation.pathname).to.equal('/')
        })
      })

      describe('when clicking on new game button', () => {
        it('should go to new game form route', () => {
          cy.get('[data-cy=home]')
          cy.get('[data-cy=start-a-new-game]').click()
          cy.get('[data-cy=user-list-select]').then(() => {
            // @ts-ignore
            expect(testLocation.pathname).to.equal('/new-game/select-opponent')
          })
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

    describe('when user session is not valid', () => {
      it('should be logged out after expiring session', () => {
        dateNowStub.restore()

        mount(<TestApp />)

        cy.get('[data-cy=test]').then(() => {
          // @ts-ignore
          expect(testLocation.pathname).to.equal('/login')
        })
      })
    })
  })
})
