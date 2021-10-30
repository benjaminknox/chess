import * as React from 'react'
import { LoginFormContainer } from '.'
import { mount } from '@cypress/react'
import { mountWithFetchMocking } from '@testUtils'
import { ConfigsResponse, ConfigsProviderForTesting } from '@common'

describe('LoginFormContainer', () => {
  const testUser = 'testUser'
  const basePath = 'http://test'
  const testPassword = 'testPassword'
  const loginPath = `${basePath}/api/jwt/login`
  const auth : string = btoa(`${testUser}:${testPassword}`)

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
      })

      typeUserName()

      cy.get('[data-cy="login-form-submit"]')
        .click()
        .then(() => {
          //@ts-ignore
          expect(fetchMock).to.be.calledOnce
        })
    })

    it('shows loading button when submiting', () => {
      const fetchMock = mountWithFetchMocking(<TestLoginFormContainer />, {
        path: loginPath,
        method: 'POST',
        inputData: { auth },
        delay: 3000,
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
        error: true
      })

      cy.get('[data-cy="login-form-submit"]').click()
      cy.get('[data-cy="login-form-error"]').should("exist")
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
      <ConfigsProviderForTesting config={configsForUse}>
        <LoginFormContainer />
      </ConfigsProviderForTesting>
    )
  }
})
