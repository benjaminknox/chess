import mongoose from 'mongoose'
import { setConfig, getConfig } from 'config'
import { MongoMemoryServer } from 'mongodb-memory-server'

export const mongoServer = new MongoMemoryServer()

export const dbConnect = async () => {
  await mongoServer.start()

  setConfig({ mongodbConnection: mongoServer.getUri() })
}

export const dbDisconnect = async () => {
  await mongoose.connection.dropDatabase()
  await mongoose.connection.close()
  await mongoServer.stop()
}
