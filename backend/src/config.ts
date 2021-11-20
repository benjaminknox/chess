export interface IConfig {
  port: number
  oauthClientId: string
  keycloakUri: string | undefined
  keycloakRealm: string | undefined
  oauthClientUrl: string | undefined
  oauthClientSecret: string | undefined
  oauthValidationUrl: string | undefined
}

export const config: IConfig = {
  keycloakUri: process.env.KEYCLOAK_URI,
  keycloakRealm: process.env.KEYCLOAK_REALM,
  oauthClientUrl: process.env.OAUTH_CLIENT_URL,
  oauthClientSecret: process.env.OAUTH_CLIENT_SECRET,
  oauthValidationUrl: process.env.OAUTH_VALIDATION_URL,
  oauthClientId: process.env.OAUTH_CLIENT_ID || 'chess',
  port: (process.env.NODE_PORT && parseInt(`${process.env.NODE_PORT}`)) || 3000,
}

export default config
