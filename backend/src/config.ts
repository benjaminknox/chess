export interface IConfigWrapper {
  config: IConfig
}

export interface IConfig {
  port: number
  oauthClientId: string
  keycloakUri: string | undefined
  keycloakRealm: string | undefined
  oauthClientUrl: string | undefined
  redisConnection: string | undefined
  mongodbConnection: string | undefined
  oauthClientSecret: string | undefined
  oauthValidationUrl: string | undefined
}

const defaultConfig: IConfig = {
  keycloakUri: process.env.KEYCLOAK_URI,
  keycloakRealm: process.env.KEYCLOAK_REALM,
  oauthClientUrl: process.env.OAUTH_CLIENT_URL,
  redisConnection: process.env.REDIS_CONNECTION,
  mongodbConnection: process.env.MONGODB_CONNECTION,
  oauthClientSecret: process.env.OAUTH_CLIENT_SECRET,
  oauthValidationUrl: process.env.OAUTH_VALIDATION_URL,
  oauthClientId: process.env.OAUTH_CLIENT_ID || 'chess',
  port: (process.env.NODE_PORT && parseInt(`${process.env.NODE_PORT}`)) || 3000,
}

export const testConfig: IConfig = {
  port: 3000,
  keycloakRealm: 'test-realm',
  mongodbConnection: 'test-uri',
  oauthClientId: 'test-client-id',
  redisConnection: 'redis-test-uri',
  keycloakUri: 'http://keycloak-uri',
  oauthClientUrl: 'http://test-client',
  oauthClientSecret: 'test-client-secret',
  oauthValidationUrl: 'http://test-client/validate',
}

const configWrapper = {
  config: defaultConfig,
}

export interface ITestDbConfig {
  Memory: boolean
  IP: string
  Port: string
  Database: string
}

export const testDbConfig: ITestDbConfig = {
  Memory: true,
  Port: '27018',
  IP: '127.0.0.1',
  Database: 'chess',
}

export const getConfig = () => configWrapper.config

export function setConfig(config: Partial<IConfig>) {
  configWrapper.config = {
    ...configWrapper.config,
    ...config,
  }
}
