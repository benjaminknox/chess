import * as React from 'react'
import { mount } from '@cypress/react'
import { LoginForm, LoginFormProps } from './LoginForm'

describe('LoginForm', () => {
  let onSubmit: (a: string, b: string) => void

  beforeEach(() => {
    onSubmit = cy.stub()
  })

  describe('when form loads', () => {
    beforeEach(() => {
      mount(<TestLoginForm />)
    })

    it('shows the login form elements', () => {
      cy.get('[data-cy="login-form-wrapper"]').should('exist')
      cy.get('[data-cy="login-form-header"]').contains('Chess')

      cy.get('[data-cy="login-form-email"]').should('exist')
      cy.get('[data-cy="login-form-password"]').should('exist')
      cy.get('[data-cy="login-form-submit"]').contains('Sign in')
    })

    it("doesn't show loading state", () => {
      cy.get('[data-cy="login-form-submit"]').should('not.be.disabled')
      cy.get('[data-cy="login-form-submit"]').contains('Sign in')
    })
  })

  describe('when filling out the form', () => {
    it('submits the values of username and password', () => {
      mount(<TestLoginForm />)

      cy.get('[data-cy="login-form-email"]').type('testUser')
      cy.get('[data-cy="login-form-password"]').type('testPassword')
      cy.get('[data-cy="login-form-submit"]')
        .click()
        .then(() => {
          //@ts-ignore
          expect(onSubmit).to.be.calledWith('testUser', 'testPassword')
        })
    })

    it('shows failed state on password', () => {
      const message = 'Test password failed'
      mount(<TestLoginForm passwordFailed={message} />)

      cy.get('[data-cy="login-form-password"]').should('exist')
      cy.get('[data-cy="login-form-password"]').contains(message)
    })

    it('shows failed state on email', () => {
      const message = 'Test email failed'
      mount(<TestLoginForm emailFailed={message} />)

      cy.get('[data-cy="login-form-email"]').should('exist')
      cy.get('[data-cy="login-form-email"]').contains(message)
    })

    it('shows failed state on submit', () => {
      const message = 'Could not login, please try again'
      mount(<TestLoginForm submitFailed={message} />)

      cy.get('[data-cy="login-form-error"]').should('exist')
      cy.get('[data-cy="login-form-error"]').contains(message)
    })
  })

  describe('when loading', () => {
    it('shows loading state', () => {
      mount(<TestLoginForm loading={true} />)

      cy.get('[data-cy="login-form-submit"]').should('be.disabled')
      cy.get('[data-cy="login-form-submit"]').not('Sign in')
    })
  })

  const TestLoginForm = (props: Partial<LoginFormProps>) => {
    const Defaults: LoginFormProps = {
      loading: false,
      onSubmit: onSubmit,
    }

    const propsToUse: LoginFormProps = { ...Defaults, ...props }

    return <LoginForm {...propsToUse} />
  }
})
