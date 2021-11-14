import * as React from 'react'
import { mount } from '@cypress/react'
import { Method } from '@api/common/Method'
import { SinonStub } from 'cypress/types/sinon'

export interface FetchMock {
  path: string
  method: Method
  delay?: number
  error?: boolean
  status?: number
  inputData?: any
  responseData?: any
  headers?: any
}

interface MockLookup {
  [k: string]: FetchMock
}

export function mountWithFetchMocking(
  children: React.ReactElement,
  ...mocks: FetchMock[]
): Cypress.Agent<SinonStub> {
  const stub = setupFetchMocks(mocks)
  mount(<>{children}</>)
  return stub
}

function mockLookupArgBuilder(mocks: Array<FetchMock>) {
  return mocks.reduce<MockLookup>((lookup, mock) => {
    let args: any = {
      path: mock.path,
      method: mock.method,
    }

    if (mock.inputData) {
      args = { ...args, body: JSON.stringify(mock.inputData) }
    }

    const key = JSON.stringify(args)

    lookup[key] = mock

    return lookup
  }, {})
}

function throwFetchMocks(mocks: FetchMock[], args: any) {
  throw new Error(
    `No matching api mock\n\nExpected to find mock: ${JSON.stringify(
      args,
      null,
      2
    )}\n\nAll mocks: ${JSON.stringify(mocks, null, 2)}`
  )
}

function setupFetchMocks(mocks: FetchMock[]): Cypress.Agent<SinonStub> {
  const stub = cy.stub(window, 'fetch')
  const mockedArgs = mockLookupArgBuilder(mocks)

  stub.callsFake(async (path: string, params: any) => {
    const { headers, ...args } : any  = { path, ...params }
    const matchingMock = mockedArgs[JSON.stringify(args)]
    if (matchingMock) {
      const { delay, status, error, responseData } = matchingMock
      await new Promise(resolve => setTimeout(resolve, delay))
      if (error) {
        throw new Error('Request Failed')
      }
      return {
        status: status || 200,
        data: responseData || {},
      }
    } else {
      throwFetchMocks(mocks, args)
    }
  })

  return stub
}
