import { StoreonModule } from 'storeon'

export interface ApiState {
  apiBasePath: string
}

export interface ApiEvents {
  ['api/setApiBasePath']: string
}

export const Api: StoreonModule<ApiState, ApiEvents> = store => {
  store.on('@init', () => ({ apiBasePath: 'http://test' }))
  store.on('api/setApiBasePath', (state, apiBasePath: string) => {
    return {
      ...state,
      apiBasePath,
    }
  })
}
