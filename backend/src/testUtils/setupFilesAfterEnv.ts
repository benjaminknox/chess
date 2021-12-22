import { dbConnect, dbDisconnect } from './db/handler'

beforeEach(async () => {
  await dbConnect()
})

afterEach(async () => {
  await dbDisconnect()
})
