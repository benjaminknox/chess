import { Context } from 'koa'
import { getConfig } from 'config'
import { createClient } from 'redis'
import { createMockContext } from '@shopify/jest-koa-mocks'

const publishMock = jest.fn()
const pSubscribeMock = jest.fn()

jest.mock('redis', () => ({
  createClient: jest.fn(() => ({
    on: () => {},
    quit: () => {},
    connect: () => {},
    publish: publishMock,
    pUnsubscribe: () => {},
    pSubscribe: pSubscribeMock,
  })),
}))

import { publishMessage, subscribe } from './redis'

describe('redis', () => {
  const config = getConfig()
  const channelName = 'channel-name'

  it('publish to a redis subscription', async () => {
    const testMessage = 'test-message'

    await publishMessage(channelName, testMessage)

    expect(createClient).toHaveBeenCalled()
    expect(publishMock).toHaveBeenCalledWith(channelName, testMessage)
    expect(createClient).toHaveBeenCalledWith({ url: config.redisConnection })
  })

  it('subscribes to a redis subscription', async () => {
    const context = createMockContext()

    context.websocket = {
      on: () => {},
      send: () => {},
    }

    await subscribe(channelName, context)

    expect(createClient).toHaveBeenCalled()
    expect(createClient).toHaveBeenCalledWith({ url: config.redisConnection })
    expect(pSubscribeMock).toHaveBeenCalledWith(channelName, expect.any(Function))
  })
})
