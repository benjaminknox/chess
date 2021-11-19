export interface IConfig {
  port: number
  oauthClientId: string
  oauthClientUrl: string | undefined
  oauthClientSecret: string | undefined
  oauthValidationUrl: string | undefined
}

export const config: IConfig = {
  oauthClientUrl: process.env.OAUTH_CLIENT_URL,
  oauthClientSecret: process.env.OAUTH_CLIENT_SECRET,
  oauthValidationUrl: process.env.OAUTH_VALIDATION_URL,
  oauthClientId: process.env.OAUTH_CLIENT_ID || 'chess',
  port: (process.env.NODE_PORT && parseInt(`${process.env.NODE_PORT}`)) || 3000,
}

export default config
