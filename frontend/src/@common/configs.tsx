import React, { useState, useEffect, useContext } from 'react'

interface Configs {
  apiBasePath: string
}

export interface ConfigsResponse {
  values: Configs | undefined
  loading: boolean
  failed: boolean
}

const ConfigsContext = React.createContext<ConfigsResponse>({
  values: undefined,
  loading: false,
  failed: false,
})

interface ConfigsProviderProps {
  children: React.ReactElement
}

export function ConfigsProvider(props: ConfigsProviderProps) {
  const response = useConfigsResponse()
  return (
    <ConfigsContext.Provider value={response}>{props.children}</ConfigsContext.Provider>
  )
}

interface ConfigsProviderForTestingProps {
  config: ConfigsResponse
  children: React.ReactElement
}

export function ConfigsProviderForTesting(props: ConfigsProviderForTestingProps) {
  return (
    <ConfigsContext.Provider value={props.config}>
      {props.children}
    </ConfigsContext.Provider>
  )
}

export function useConfigs(): ConfigsResponse {
  return useContext(ConfigsContext)
}

function useConfigsResponse(): ConfigsResponse {
  const [configs, setConfigs] = useState<Configs>()

  useEffect(() => {
    setConfigs({
      apiBasePath: process.env.REACT_APP_API_BASE_PATH ?? '',
    })
  }, [])

  return {
    values: configs,
    loading: false,
    failed: false,
  }
}
