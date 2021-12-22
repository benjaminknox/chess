import config from 'config'
import mongoose from 'mongoose'
import { Context, Next } from 'koa'
import { default as Koa } from 'koa'

export const database = async () => {
  if(config.mongodbConnection) {
    try {
      await mongoose.connect(config.mongodbConnection)
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
