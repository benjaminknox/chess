import { IConfig } from '../config'

const config: IConfig = {
  port: 3000,
  keycloakRealm: 'test-realm',
  oauthClientId: 'test-client-id',
  keycloakUri: 'http://keycloak-uri',
  oauthClientUrl: 'http://test-client',
  oauthClientSecret: 'test-client-secret',
  mongodbConnection: 'mongodb://test-uri',
  oauthValidationUrl: 'http://test-client/validate',
}

export default config
