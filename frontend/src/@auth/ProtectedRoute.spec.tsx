import * as React from 'react'
import { Auth } from '@store/auth'
import { mount } from '@cypress/react'
import { createStoreon } from 'storeon'
import { StoreContext } from 'storeon/react'
import { ProtectedRoute } from './ProtectedRoute'
import { mountWithFetchMocking } from '@testUtils'
import { ConfigsProviderForTesting } from '@common'
import { fakeIdentity } from '@testUtils/fakeIdentity'
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

      store.dispatch('auth/setIdentity', fakeIdentity)

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
    describe('when refresh token is not expired', () => {
      it('should not be logged out', () => {
        let dateNowStub = cy.stub(Date, 'now').callsFake(() => 0)
        const store = createStoreon([Auth])

        const identityResponse = {
          ...fakeIdentity,
          refresh_expires_in: 10000,
        }

        store.dispatch('auth/setIdentity', identityResponse)

        dateNowStub.restore()

        dateNowStub = cy.stub(Date, 'now').callsFake(() => 6000000)

        const responseData = {
          ...fakeIdentity,
          expires_in: 10000,
          refresh_expires_in: 17000,
        }

        const apiBasePath = 'http://test/api'

        mountWithFetchMocking(
          <StoreContext.Provider value={store}>
            <ConfigsProviderForTesting
              config={{ values: { apiBasePath }, loading: false, failed: false }}
            >
              <TestComponent />
            </ConfigsProviderForTesting>
          </StoreContext.Provider>,
          {
            path: `${apiBasePath}/jwt/refresh`,
            method: 'POST',
            inputData: {
              token: identityResponse.refresh_token,
            },
            responseData,
            headers: {
              'Content-type': 'application/json',
            },
          }
        )

        cy.get('[data-cy=test]').then(() => {
          // @ts-ignore
          expect(testLocation.pathname).to.equal('/')
          //@ts-ignore
          expect(store.get().Auth.session.refreshTokenExpiration).to.equal(23000000)
        })
      })
    })

    describe('when refresh token is expired', () => {
      it('should be logged out', () => {
        const dateNowStub = cy.stub(Date, 'now').callsFake(() => 0)
        const store = createStoreon([Auth])

        store.dispatch('auth/setIdentity', fakeIdentity)

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
