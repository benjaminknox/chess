import dotenv from 'dotenv'

dotenv.config()

import { getConfig } from 'config'

import app from './app'

app().listen(getConfig().port)

console.log(`Server running on port ${getConfig().port} 🚀`)
