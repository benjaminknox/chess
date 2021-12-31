import qs from 'qs'
import axios from 'axios'
import { Context } from 'koa'
import { getConfig, IConfig } from 'config'
import { default as Router } from 'koa-router'

const userRouter: Router = new Router({
  prefix: '/users',
})

const getKeycloakAdminAccess = async (config: IConfig) =>
  await axios({
    url: `${config.keycloakUri}/auth/realms/${config.keycloakRealm}/protocol/openid-connect/token`,
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
    data: qs.stringify({
      client_id: config.oauthClientId,
      grant_type: 'client_credentials',
      client_secret: config.oauthClientSecret,
    }),
  })

userRouter.get('/', async (context: Context) => {
  const config = getConfig()

  const admin: any = await getKeycloakAdminAccess(config)

  await axios({
    url: `${config.keycloakUri}/auth/admin/realms/${config.keycloakRealm}/users`,
    method: 'GET',
    headers: { authorization: `${admin.data.token_type} ${admin.data.access_token}` },
  }).then((response: any) => {
    context.body = response.data
    context.status = 200
  })
})

userRouter.get('/:id', async (context: Context) => {
  const config = getConfig()

  const admin: any = await getKeycloakAdminAccess(config)

  await axios({
    url: `${config.keycloakUri}/auth/admin/realms/${config.keycloakRealm}/users/${context.params.id}`,
    method: 'GET',
    headers: { authorization: `${admin.data.token_type} ${admin.data.access_token}` },
  }).then((response: any) => {
    context.body = response.data
    context.status = 200
  })
})

export default userRouter
