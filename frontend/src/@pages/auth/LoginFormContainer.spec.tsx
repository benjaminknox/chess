import * as React from 'react'
import { Auth } from '@store/auth'
import { LoginFormContainer } from '.'
import { mount } from '@cypress/react'
import { createStoreon } from 'storeon'
import { StoreContext } from 'storeon/react'
import { BrowserRouter } from 'react-router-dom'
import { mountWithFetchMocking } from '@testUtils'
import { fakeIdentity } from '@testUtils/fakeIdentity'
import { ConfigsResponse, ConfigsProviderForTesting } from '@common'

describe('LoginFormContainer', () => {
  let store: any
  const testUser = 'testUser'
  const basePath = 'http://test'
  const testPassword = 'testPassword'
  const loginPath = `${basePath}/api/jwt/login`
  const auth: string = btoa(`${testUser}:${testPassword}`)

  beforeEach(() => {
    store = createStoreon([Auth])
  })

  const typeUserName = () => {
    cy.get('[data-cy="login-form-email"]').type(testUser)
    cy.get('[data-cy="login-form-password"]').type(testPassword)
  }

  describe('when username and password is valid', () => {
    it('submits the values of username and password', () => {
      const fetchMock = mountWithFetchMocking(<TestLoginFormContainer />, {
        path: loginPath,
        method: 'POST',
        inputData: { auth },
        headers: {
          'Content-type': 'application/json',
        },
      })

      typeUserName()

      cy.get('[data-cy="login-form-submit"]')
        .click()
        .then(() => {
          //@ts-ignore
          expect(fetchMock).to.be.calledOnce
        })
    })

    it('sets the user session on the store', () => {
      const responseData = fakeIdentity

      const fetchMock = mountWithFetchMocking(<TestLoginFormContainer />, {
        path: loginPath,
        method: 'POST',
        inputData: { auth },
        responseData,
        headers: {
          'Content-type': 'application/json',
        },
      })

      typeUserName()

      cy.get('[data-cy="login-form-submit"]')
        .click()
        .then(() => {
          //@ts-ignore
          expect(store.get().Auth.identity).to.equal(responseData)
        })
    })

    it('shows loading button when submiting', () => {
      const fetchMock = mountWithFetchMocking(<TestLoginFormContainer />, {
        path: loginPath,
        method: 'POST',
        inputData: { auth },
        delay: 3000,
        headers: {
          'Content-type': 'application/json',
        },
      })

      typeUserName()

      cy.get('[data-cy="login-form-submit"]').click()
      cy.get('[data-cy="login-form-submit"]').should('be.disabled')
      cy.get('[data-cy="login-form-submit"]').not('Sign in')
    })

    it('shows error message on request failure', () => {
      const fetchMock = mountWithFetchMocking(<TestLoginFormContainer />, {
        path: loginPath,
        method: 'POST',
        inputData: { auth },
        error: true,
        headers: {
          'Content-type': 'application/json',
        },
      })

      cy.get('[data-cy="login-form-submit"]').click()
      cy.get('[data-cy="login-form-error"]').should('exist')
    })
  })

  const TestLoginFormContainer = (config: Partial<ConfigsResponse>) => {
    const defaultConfig: ConfigsResponse = {
      values: { apiBasePath: basePath },
      loading: false,
      failed: false,
    }

    const configsForUse: ConfigsResponse = {
      ...defaultConfig,
      ...config,
    }

    return (
      <BrowserRouter>
        <StoreContext.Provider value={store}>
          <ConfigsProviderForTesting config={configsForUse}>
            <LoginFormContainer />
          </ConfigsProviderForTesting>
        </StoreContext.Provider>
      </BrowserRouter>
    )
  }
})
