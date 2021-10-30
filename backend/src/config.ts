export interface IConfig {
  port: number
  oauthClientId: string
  oauthClientSecret: string | undefined
  oauthClientUrl: string | undefined
}

export const config: IConfig = {
  port: (process.env.NODE_PORT && parseInt(`${process.env.NODE_PORT}`)) || 3000,
  oauthClientId: process.env.OAUTH_CLIENT_ID || 'chess',
  oauthClientSecret: process.env.OAUTH_CLIENT_SECRET,
  oauthClientUrl: process.env.OAUTH_CLIENT_URL,
}

export default config
