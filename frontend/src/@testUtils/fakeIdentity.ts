import fakeAccessToken from './fakeAccessToken'

export const fakeIdentity = {
  expires_in: 5000,
  scope: 'test-scope',
  token_type: 'Bearer',
  id_token: 'test-id-token',
  access_token: fakeAccessToken,
  refresh_token: 'test-refresh-token',
  session_state: 'test-sessions-state-id',
  refresh_expires_in: 6000,
  ['not-before-policy']: 0,
}
