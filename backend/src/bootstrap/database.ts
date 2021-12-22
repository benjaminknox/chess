import { getConfig } from 'config'
import mongoose from 'mongoose'
import { Context, Next } from 'koa'
import { default as Koa } from 'koa'

export const database = async () => {
  const mongodbConnection = getConfig().mongodbConnection
  if (mongodbConnection) {
    try {
      await mongoose.connect(mongodbConnection, { dbName: "chess"})

      console.log("Successfully connected to the database.");

    } catch (ex: any) {
      if (ex.codeName === 'AuthenticationFailed') {
        console.error('Could not authenticate with mongodb')
      } else {
        throw ex
      }
    }
  } else {
    console.error('No password provided for mongodb')
  }
}
