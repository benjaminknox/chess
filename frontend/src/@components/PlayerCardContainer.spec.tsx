import * as React from 'react'
import createStore from '@store'
import { User, Align } from '@types'
import { StoreContext } from 'storeon/react'
import { fakeIdentity } from '@testUtils/fakeIdentity'
import { PlayerCardContainer } from './PlayerCardContainer'
import { decodedFakeAccessToken } from '@testUtils/fakeAccessToken'
import { ConfigsResponse, ConfigsProviderForTesting } from '@common'
import { mountWithFetchMocking, generateRandomUser } from '@testUtils'

describe('PlayerCardContainer', () => {
  const store = createStore()
  const basePath = 'http://test'
  let user: User
  beforeEach(() => {
    store.dispatch('auth/setIdentity', fakeIdentity)
    user = generateRandomUser()
  })

  it('should show player name with left alignment', () => {
    mountPlayerCardContainer('left')
    cy.get('[data-cy=avatar-left]').contains(user.username)
  })

  it('should show player name with right alignment', () => {
    mountPlayerCardContainer('right')
    cy.get('[data-cy=avatar-right]').contains(user.username)
  })

  it('should use "me" for name if logged in user is the player', () => {
    mountPlayerCardContainer('right', decodedFakeAccessToken.sub)
    cy.get('[data-cy=avatar-right]').should('not.contain', user.username)
  })

  function mountPlayerCardContainer(align: Align, userId = 'test-user-id') {
    return mountWithFetchMocking(
      <StoreContext.Provider value={store}>
        <ConfigsProviderForTesting
          config={{
            values: {
              apiBasePath: 'http://test',
              websocketBasePath: 'ws://test',
            },
            loading: false,
            failed: false,
          }}
        >
          <PlayerCardContainer userId={userId} align={align} />
        </ConfigsProviderForTesting>
      </StoreContext.Provider>,
      {
        path: `${basePath}/users/${userId}`,
        method: 'GET',
        responseData: { ...user, id: userId },
        headers: {
          'Content-type': 'application/json',
          Authorization: `Bearer ${fakeIdentity.access_token}`,
        },
      }
    )
  }
})
